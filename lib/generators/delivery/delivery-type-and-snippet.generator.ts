import { ContentTypeModels, ContentTypeSnippetModels, type TaxonomyModels } from "@kontent-ai/management-sdk";
import { match, P } from "ts-pattern";
import { deliveryConfig } from "../../config.js";
import { formatGuidelinesComment, wrapComment } from "../../core/comment.utils.js";
import type { FlattenedElement, GeneratedTypeModel, MultipleChoiceOption } from "../../core/core.models.js";
import { isNotUndefined, sortAlphabetically, uniqueFilter } from "../../core/core.utils.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { getImporter } from "../../core/importer.js";
import { resolveCase } from "../../core/resolvers.js";
import type { DeliveryGeneratorConfig } from "./delivery.generator.js";
import { getDeliveryEntityNamesGenerator } from "./delivery-entity-name.generator.js";

type ExtractImportsResult = {
	readonly typeName: string;
	readonly imports: readonly string[];
	readonly contentTypeExtends: string | undefined;
};

type ContentTypeOrSnippet = Readonly<ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet>;

export type DeliveryTypeAndSnippetGeneratorConfig = DeliveryGeneratorConfig;

export function getDeliveryTypeAndSnippetGenerator(config: DeliveryTypeAndSnippetGeneratorConfig) {
	const importer = getImporter(config.moduleFileExtension);
	const contentTypeNames = getDeliveryEntityNamesGenerator({
		nameResolvers: config.nameResolvers,
		fileResolvers: config.fileResolvers,
		entityType: "Type",
	}).getEntityNames();

	const snippetNames = getDeliveryEntityNamesGenerator({
		nameResolvers: config.nameResolvers,
		fileResolvers: config.fileResolvers,
		entityType: "Snippet",
	}).getEntityNames();

	const taxonomyNames = getDeliveryEntityNamesGenerator({
		nameResolvers: config.nameResolvers,
		fileResolvers: config.fileResolvers,
		entityType: "Taxonomy",
	}).getEntityNames();

	const getCoreTypeImport = (): string =>
		importer.importType({
			filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${contentTypeNames.overviewFilename}`,
			importValue: [deliveryConfig.coreContentTypeName],
		});

	const getSchemaImport = (): string =>
		importer.importType({
			filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${deliveryConfig.mainSystemFilename}.ts`,
			importValue: deliveryConfig.coreClientSchemaTypeName,
		});

	// 'CoreType' is only referenced when a linked-items / rich-text element has no explicitly allowed content types.
	const usesCoreTypeFallback = (flattenedElements: readonly FlattenedElement[]): boolean =>
		flattenedElements
			.filter((m) => !m.fromSnippet)
			.some((element) =>
				match(element)
					.returnType<boolean>()
					.with({ type: P.union("modular_content", "subpages", "rich_text") }, (el) => !el.allowedContentTypes?.length)
					.otherwise(() => false),
			);

	const getContentTypesUsingSnippet = (
		snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
	): readonly Readonly<ContentTypeModels.ContentType>[] =>
		config.environmentData.types.filter((type) =>
			type.elements.some((element) =>
				match(element)
					.returnType<boolean>()
					.with({ type: "snippet" }, (snippetElement) => snippetElement.snippet.id === snippet.id)
					.otherwise(() => false),
			),
		);

	const getSnippetUsingTypeImports = (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): readonly string[] =>
		getContentTypesUsingSnippet(snippet).map((type) =>
			importer.importType({
				filePathOrPackage: `../${contentTypeNames.folderName}/${contentTypeNames.getEntityFilename(type, true)}`,
				importValue: contentTypeNames.getCodenameTypeName(type),
			}),
		);

	const getSnippetImports = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): readonly string[] => {
		if (snippets.length === 0) {
			return [];
		}

		return snippets.map((snippet) =>
			importer.importType({
				filePathOrPackage: `../${snippetNames.folderName}/${snippetNames.getEntityFilename(snippet, true)}`,
				importValue: getNameOfElementsShapeType(snippet),
			}),
		);
	};

	const getReferencedTypeImports = (typeOrSnippet: ContentTypeOrSnippet, elements: readonly FlattenedElement[]): readonly string[] => {
		const filteredTypesToImport: readonly Readonly<ContentTypeModels.ContentType>[] = elements
			.filter((m) => !m.fromSnippet)
			.flatMap((flattenedElement) => {
				return match(flattenedElement)
					.returnType<readonly Readonly<ContentTypeModels.ContentType>[]>()
					.with(
						P.union({ type: "modular_content" }, { type: "subpages" }, { type: "rich_text" }),
						(alementWithAllowedContentTypes) => {
							return (alementWithAllowedContentTypes.allowedContentTypes ?? []).filter((allowedContentType) => {
								// filter self-referencing types as they do not need to be importer
								if (allowedContentType.codename === typeOrSnippet.codename) {
									return false;
								}
								return true;
							});
						},
					)
					.otherwise(() => []);
			})
			.filter(isNotUndefined)
			.reduce<Readonly<ContentTypeModels.ContentType>[]>((uniqueTypes, type) => {
				if (uniqueTypes.some((m) => m.codename === type.codename)) {
					return uniqueTypes;
				}

				uniqueTypes.push(type);

				return uniqueTypes;
			}, []);

		if (filteredTypesToImport.length === 0) {
			return [];
		}

		return filteredTypesToImport.map((type) => {
			return importer.importType({
				filePathOrPackage: `../${contentTypeNames.folderName}/${contentTypeNames.getEntityFilename(type, true)}`,
				importValue: contentTypeNames.getEntityName(type),
			});
		});
	};

	const getReferencedTaxonomyImports = (
		typeOrSnippet: Readonly<ContentTypeModels.ContentType> | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
		elements: readonly FlattenedElement[],
	): readonly string[] => {
		const filteredTaxonomiesToImport: readonly Readonly<TaxonomyModels.Taxonomy>[] = elements
			// only take elements that are not from snippets
			.filter((m) => !m.fromSnippet)
			.map((flattenedElement) => {
				return match(flattenedElement)
					.returnType<Readonly<TaxonomyModels.Taxonomy> | undefined>()
					.with({ type: "taxonomy" }, (taxonomyElement) => {
						if (!taxonomyElement.assignedTaxonomy) {
							const usedIn = match(typeOrSnippet)
								.returnType<string>()
								.with(P.instanceOf(ContentTypeSnippetModels.ContentTypeSnippet), (m) => `snippet '${m.codename}'`)
								.otherwise(() => `content type '${typeOrSnippet.codename}'`);

							console.warn(
								`Skipping invalid taxonomy for element '${taxonomyElement.codename}' used in ${usedIn}. This reference has to be fixed in your Kontent project.`,
							);

							return undefined;
						}

						return taxonomyElement.assignedTaxonomy;
					})
					.otherwise(() => undefined);
			})
			.filter(isNotUndefined)
			.reduce<Readonly<TaxonomyModels.Taxonomy>[]>((uniqueTaxonomies, taxonomy) => {
				if (uniqueTaxonomies.some((m) => m.codename === taxonomy.codename)) {
					return uniqueTaxonomies;
				}

				uniqueTaxonomies.push(taxonomy);

				return uniqueTaxonomies;
			}, []);

		if (filteredTaxonomiesToImport.length === 0) {
			return [];
		}

		return filteredTaxonomiesToImport.map((taxonomy) => {
			return importer.importType({
				filePathOrPackage: `../${taxonomyNames.folderName}/${taxonomyNames.getEntityFilename(taxonomy, true)}`,
				importValue: [getTaxonomyTermCodenamesTypeName(taxonomy)],
			});
		});
	};

	const getTaxonomyTermCodenamesTypeName = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
		return taxonomyNames.termsNames.codenamesTypeName(taxonomy);
	};

	const getContentTypeModelImports = (data: {
		readonly contentType: Readonly<ContentTypeModels.ContentType>;
		readonly flattenedElements: readonly FlattenedElement[];
	}): ExtractImportsResult => {
		const snippets = data.flattenedElements.map((flattenedElement) => flattenedElement.fromSnippet).filter(isNotUndefined);

		return {
			imports: sortAlphabetically(
				[
					getSchemaImport(),
					...(usesCoreTypeFallback(data.flattenedElements) ? [getCoreTypeImport()] : []),
					...getReferencedTypeImports(data.contentType, data.flattenedElements),
					...getReferencedTaxonomyImports(data.contentType, data.flattenedElements),
					...getSnippetImports(snippets),
				]
					.filter(isNotUndefined)
					.filter(uniqueFilter),
				(importValue) => importValue,
			),
			contentTypeExtends: snippets.length
				? `& ${sortAlphabetically(
						snippets.map((snippet) => getNameOfElementsShapeType(snippet)).filter(uniqueFilter),
						(snippetName) => snippetName,
					).join(" & ")}`
				: undefined,
			typeName: contentTypeNames.getEntityName(data.contentType),
		};
	};

	const getSnippetModelImports = (data: {
		readonly snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
		readonly flattenedElements: readonly FlattenedElement[];
	}): ExtractImportsResult => {
		return {
			imports: sortAlphabetically(
				[
					getSchemaImport(),
					...(usesCoreTypeFallback(data.flattenedElements) ? [getCoreTypeImport()] : []),
					...getReferencedTypeImports(data.snippet, data.flattenedElements),
					...getReferencedTaxonomyImports(data.snippet, data.flattenedElements),
					...getSnippetUsingTypeImports(data.snippet),
				]
					.filter(isNotUndefined)
					.filter(uniqueFilter),
				(importValue) => importValue,
			),
			contentTypeExtends: undefined,
			typeName: snippetNames.getEntityName(data.snippet),
		};
	};

	const getTypeDeliverySdkImports = (
		typeOrSnippet: ContentTypeOrSnippet,
		flattenedElements: readonly FlattenedElement[],
	): readonly string[] => {
		return sortAlphabetically(
			[
				// type guards (content type & snippet) reference 'ContentItemPayload'; the wrapper type differs per entity
				deliveryConfig.sdkTypes.contentItemPayload,
				...(typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet
					? [deliveryConfig.sdkTypes.snippetOf]
					: [deliveryConfig.sdkTypes.contentItemOf]),
				// only import elements type if there is at least one element that is represented by property and is not from a snippet
				...(flattenedElements.filter((m) => m.isElementWithProperty && !m.fromSnippet).length
					? [deliveryConfig.sdkTypes.elements]
					: []),
			],
			(importValue) => importValue,
		);
	};

	const getSnippetCode = (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): GeneratedTypeModel => {
		const flattenedElements = getFlattenedElements({
			elements: snippet.elements,
			snippets: config.environmentData.snippets,
			taxonomies: config.environmentData.taxonomies,
			types: config.environmentData.types,
		});

		const importsResult = getSnippetModelImports({
			snippet,
			flattenedElements,
		});

		const nameOfTypeRepresentingAllElementCodenames = getNameOfTypeRepresentingAllElementCodenames(snippet);
		const elementsShapeName = getNameOfElementsShapeType(snippet);
		const usingTypes = getContentTypesUsingSnippet(snippet);
		const usingTypeCodenamesUnion = usingTypes.length
			? usingTypes.map((type) => contentTypeNames.getCodenameTypeName(type)).join(" | ")
			: "never";

		return {
			imports: [
				importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: `${getTypeDeliverySdkImports(snippet, flattenedElements).join(", ")}`,
				}),
				...importsResult.imports,
			],
			code: `
${wrapComment(`Elements of the '${snippet.name}' snippet. Intersect this into the elements of content types that use the snippet.`, {
	disableComments: config.disableComments,
	lines: [
		{
			name: "Id",
			value: snippet.id,
		},
		{
			name: "Codename",
			value: snippet.codename,
		},
	],
})}
export type ${elementsShapeName} = ${getElementsCode(snippet, flattenedElements)};

${wrapComment(`Snippet '${snippet.name}' as a partial content item across the content types that use it`, { disableComments: config.disableComments })}
export type ${importsResult.typeName} = ${deliveryConfig.sdkTypes.snippetOf}<${deliveryConfig.coreClientSchemaTypeName}, ${usingTypeCodenamesUnion}, ${elementsShapeName}>;

${wrapComment(`Type representing all available element codenames for ${snippet.name}`, { disableComments: config.disableComments })}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)}

${wrapComment(`Type guard for ${snippet.name}`, { disableComments: config.disableComments })}
${getSnippetTypeGuardFunction(snippet, usingTypes)}

${getAllMultipleChoiceTypeCodes(snippet, flattenedElements)}
`,
		};
	};

	const getContentTypeCode = (contentType: Readonly<ContentTypeModels.ContentType>): GeneratedTypeModel => {
		const flattenedElements = getFlattenedElements({
			elements: contentType.elements,
			snippets: config.environmentData.snippets,
			taxonomies: config.environmentData.taxonomies,
			types: config.environmentData.types,
		});

		const importsResult = getContentTypeModelImports({
			contentType,
			flattenedElements,
		});

		const nameOfTypeRepresentingAllElementCodenames = getNameOfTypeRepresentingAllElementCodenames(contentType);
		const elementsShapeName = getNameOfElementsShapeType(contentType);
		const ownElementsCode = getElementsCode(contentType, flattenedElements);
		const hasOwnElements = ownElementsCode !== "Record<string, never>";
		// Merge own elements with snippet element shapes; when there are no own elements, the type IS just the snippet intersection.
		const elementsTypeExpression = importsResult.contentTypeExtends
			? hasOwnElements
				? `${ownElementsCode} ${importsResult.contentTypeExtends}`
				: importsResult.contentTypeExtends.replace(/^& /, "")
			: ownElementsCode;

		return {
			imports: [
				importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: `${getTypeDeliverySdkImports(contentType, flattenedElements).join(", ")}`,
				}),
				...importsResult.imports,
			],
			code: `
${wrapComment(`Elements of the '${contentType.name}' content type`, {
	disableComments: config.disableComments,
	lines: [
		{
			name: "Id",
			value: contentType.id,
		},
		{
			name: "Codename",
			value: contentType.codename,
		},
		{
			name: "External Id",
			value: contentType.externalId,
		},
	],
})}
export type ${elementsShapeName} = ${elementsTypeExpression};

${wrapComment(contentType.name, { disableComments: config.disableComments })}
export type ${importsResult.typeName} = ${deliveryConfig.sdkTypes.contentItemOf}<${deliveryConfig.coreClientSchemaTypeName}, ${contentTypeNames.getCodenameTypeName(contentType)}, ${elementsShapeName}>;

${wrapComment(`Type representing all available element codenames for ${contentType.name}`, { disableComments: config.disableComments })}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)};

${wrapComment(`Type guard for ${contentType.name}`, {
	disableComments: config.disableComments,
	lines: [
		{
			name: "Id",
			value: contentType.id,
		},
		{
			name: "Codename",
			value: contentType.codename,
		},
		{
			name: "External Id",
			value: contentType.externalId,
		},
	],
})}
${getContentItemTypeGuardFunction(contentType)};

${getAllMultipleChoiceTypeCodes(contentType, flattenedElements)}
`,
		};
	};

	const getMultipleChoiceTypeName = (typeOrSnippet: ContentTypeOrSnippet, element: FlattenedElement): string => {
		const typeOrSnippetName =
			typeOrSnippet instanceof ContentTypeModels.ContentType
				? contentTypeNames.getEntityName(typeOrSnippet)
				: snippetNames.getEntityName(typeOrSnippet);

		return `${typeOrSnippetName}${resolveCase(element.title, "pascalCase")}MultipleChoiceOptions`;
	};

	const getMultipleChoiceTypeCode = (
		typeOrSnippet: ContentTypeOrSnippet,
		flattenedElement: FlattenedElement,
		options: readonly MultipleChoiceOption[],
	): string => {
		return `export type ${getMultipleChoiceTypeName(typeOrSnippet, flattenedElement)} = ${options
			.map((option) => option.codename)
			.filter(isNotUndefined)
			.map((codename) => `'${codename}'`)
			.join(" | ")}`;
	};

	const getAllMultipleChoiceTypeCodes = (typeOrSnippet: ContentTypeOrSnippet, flattenedElements: readonly FlattenedElement[]): string => {
		return flattenedElements
			.map((element) => {
				return match(element)
					.returnType<string | undefined>()
					.with({ type: "multiple_choice" }, (multipleChoiceElement) => {
						// optionless multiple-choice elements map to a bare 'Elements.MultipleChoice' with no options type
						if (!multipleChoiceElement.multipleChoiceOptions?.length) {
							return undefined;
						}
						return getMultipleChoiceTypeCode(typeOrSnippet, multipleChoiceElement, multipleChoiceElement.multipleChoiceOptions);
					})
					.otherwise(() => undefined);
			})
			.filter(isNotUndefined)
			.join("\n\n");
	};

	const getElementsCode = (typeOrSnippet: ContentTypeOrSnippet, flattenedElements: readonly FlattenedElement[]): string => {
		const filteredElements = flattenedElements
			// filter out elements that are from snippets
			.filter((m) => !m.fromSnippet);

		if (filteredElements.length === 0) {
			return "Record<string, never>";
		}

		return `${filteredElements.reduce<string>((code, element, index) => {
			const mappedType = mapElementType(typeOrSnippet, element);
			const isFirstElement = index === 0;

			if (!mappedType) {
				return code;
			}

			return `${code}\n${isFirstElement ? "" : "\n"}${wrapComment(element.title, {
				disableComments: config.disableComments,
				lines: [
					{
						name: "Codename",
						value: element.codename,
					},
					{
						name: "Id",
						value: element.id,
					},
					{
						name: "External Id",
						value: element.externalId,
					},
					{
						name: "Type",
						value: element.type,
					},
					{
						name: "Required",
						value: element.isRequired ? "true" : "false",
					},
					{
						name: "From snippet",
						value: element.fromSnippet ? element.fromSnippet.codename : undefined,
					},
					{
						name: "Taxonomy",
						value: element.assignedTaxonomy ? element.assignedTaxonomy.codename : undefined,
					},
					{
						name: "Allowed content types",
						value: element.allowedContentTypes ? element.allowedContentTypes.map((m) => m.codename).join(", ") : undefined,
					},
					{
						name: "Guidelines",
						value: element.guidelines ? formatGuidelinesComment(element.guidelines) : "",
					},
				],
			})}
                readonly ${element.codename}: ${deliveryConfig.sdkTypes.elements}.${mappedType};`;
		}, "{")}}`;
	};

	const getNameOfTypeRepresentingAllElementCodenames = (typeOrSnippet: ContentTypeOrSnippet): string => {
		return `${
			typeOrSnippet instanceof ContentTypeModels.ContentType
				? contentTypeNames.getEntityName(typeOrSnippet)
				: snippetNames.getEntityName(typeOrSnippet)
		}ElementCodenames`;
	};

	const getNameOfElementsShapeType = (typeOrSnippet: ContentTypeOrSnippet): string => {
		return `${
			typeOrSnippet instanceof ContentTypeModels.ContentType
				? contentTypeNames.getEntityName(typeOrSnippet)
				: snippetNames.getEntityName(typeOrSnippet)
		}Elements`;
	};

	const getContentTypeElementCodenamesType = (typeName: string, flattenedElements: readonly FlattenedElement[]): string => {
		if (flattenedElements.length === 0) {
			return `export type ${typeName} = never`;
		}
		return `export type ${typeName} = ${flattenedElements.map((element) => `'${element.codename}'`).join(" | ")};`;
	};

	const mapElementType = (typeOrSnippet: ContentTypeOrSnippet, element: FlattenedElement): string | undefined => {
		return match(element)
			.returnType<string | undefined>()
			.with({ type: "text" }, () => "Text")
			.with({ type: "number" }, () => "Number")
			.with({ type: "modular_content" }, (linkedItemsElement) => {
				return `LinkedItems<${
					linkedItemsElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "subpages" }, (linkedItemsElement) => {
				return `LinkedItems<${
					linkedItemsElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "asset" }, () => "Asset")
			.with({ type: "date_time" }, () => "DateTime")
			.with({ type: "rich_text" }, (richTextElement) => {
				return `RichText<${
					richTextElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(richTextElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "multiple_choice" }, (multipleChoiceElement) => {
				if (!multipleChoiceElement.multipleChoiceOptions?.length) {
					return "MultipleChoice";
				}
				return `MultipleChoice<${getMultipleChoiceTypeName(typeOrSnippet, multipleChoiceElement)}>`;
			})
			.with({ type: "url_slug" }, () => "UrlSlug")
			.with({ type: "taxonomy" }, (taxonomyElement) => {
				if (!taxonomyElement.assignedTaxonomy) {
					return "Taxonomy";
				}

				return `Taxonomy<${getTaxonomyTermCodenamesTypeName(taxonomyElement.assignedTaxonomy)}>`;
			})
			.with({ type: "custom" }, () => "Custom")
			.otherwise(() => undefined);
	};

	const getLinkedItemsAllowedTypes = (types: readonly Readonly<ContentTypeModels.ContentType>[]): readonly string[] => {
		if (!types.length) {
			return [deliveryConfig.coreContentTypeName];
		}

		return types.map((type) => contentTypeNames.getEntityName(type));
	};

	const getContentItemTypeGuardFunction = (contentType: Readonly<ContentTypeModels.ContentType>): string => {
		const contentItemTypeName = contentTypeNames.getEntityName(contentType);
		const typeGuardFunctionName = contentTypeNames.typeNames.contentItemTypeguardFunctionName(contentType);
		const codenameTypeGuardFunctionName = contentTypeNames.getTypeguardFunctionName(contentType);

		return `export function ${typeGuardFunctionName}(item: ${deliveryConfig.sdkTypes.contentItemPayload}<${deliveryConfig.coreClientSchemaTypeName}> | undefined | null): item is ${contentItemTypeName} {
                return ${codenameTypeGuardFunctionName}(item?.system.type);
            }`;
	};

	const getSnippetTypeGuardFunction = (
		snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
		usingTypes: readonly Readonly<ContentTypeModels.ContentType>[],
	): string => {
		const snippetTypeName = snippetNames.getEntityName(snippet);
		const usingCodenames = usingTypes.map((type) => `'${type.codename}'`).join(", ");

		return `export function is${snippetTypeName}(item: ${deliveryConfig.sdkTypes.contentItemPayload}<${deliveryConfig.coreClientSchemaTypeName}> | undefined | null): item is ${snippetTypeName} {
                return !!item && ([${usingCodenames}] as readonly string[]).includes(item.system.type);
            }`;
	};

	return {
		generateTypeModel: (type: Readonly<ContentTypeModels.ContentType>): GeneratedTypeModel => {
			return getContentTypeCode(type);
		},
		generateSnippetModel: (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): GeneratedTypeModel => {
			return getSnippetCode(snippet);
		},
	};
}
