import type { TaxonomyModels } from "@kontent-ai/management-sdk";
import { ContentTypeModels, ContentTypeSnippetModels } from "@kontent-ai/management-sdk";
import { P, match } from "ts-pattern";
import { coreConfig, deliveryConfig } from "../../config.js";
import { toGuidelinesComment, wrapComment } from "../../core/comment.utils.js";
import type { FlattenedElement, GeneratedTypeModel, MultipleChoiceOption } from "../../core/core.models.js";
import { isNotUndefined, sortAlphabetically, uniqueFilter } from "../../core/core.utils.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { getImporter } from "../../core/importer.js";
import { resolveCase } from "../../core/resolvers.js";
import { getDeliveryEntityNamesGenerator } from "./delivery-entity-name.generator.js";
import type { DeliveryGeneratorConfig } from "./delivery.generator.js";

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

	const getCoreTypeImports = (): readonly string[] => {
		return [
			importer.importType({
				filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${coreConfig.barrelExportFilename}`,
				importValue: [deliveryConfig.coreContentTypeName].join(", "),
			}),
		];
	};

	const shouldImportCoreTypeInSnippet = (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): boolean => {
		return snippet.elements
			.map<boolean>((m) =>
				match(m)
					.returnType<boolean>()
					.with(
						P.union({ type: "modular_content" }, { type: "subpages" }, { type: "rich_text" }),
						(elementWithAllowedContentTypes) => !((elementWithAllowedContentTypes.allowed_content_types?.length ?? 0) > 0),
					)
					.otherwise(() => false),
			)
			.some((m) => m);
	};

	const getSnippetImports = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): readonly string[] => {
		if (snippets.length === 0) {
			return [];
		}

		return [
			importer.importType({
				filePathOrPackage: `../${snippetNames.folderName}/${coreConfig.barrelExportFilename}`,
				importValue: snippets
					.map((snippet) => snippetNames.getEntityName(snippet))
					.filter(uniqueFilter)
					.join(", "),
			}),
		];
	};

	const getReferencedTypeImports = (typeOrSnippet: ContentTypeOrSnippet, elements: readonly FlattenedElement[]): readonly string[] => {
		const referencedTypeNames = elements
			// only take elements that are not from snippets
			.filter((m) => !m.fromSnippet)
			.flatMap((flattenedElement) => {
				return match(flattenedElement)
					.returnType<string | string[]>()
					.with(
						P.union({ type: "modular_content" }, { type: "subpages" }, { type: "rich_text" }),
						(alementWithAllowedContentTypes) => {
							return (alementWithAllowedContentTypes.allowedContentTypes ?? [])
								.filter((allowedContentType) => {
									// filter self-referencing types as they do not need to be importer
									if (allowedContentType.codename === typeOrSnippet.codename) {
										return false;
									}
									return true;
								})
								.map((allowedContentType) => {
									return contentTypeNames.getEntityName(allowedContentType);
								});
						},
					)
					.otherwise(() => []);
			})
			.filter(isNotUndefined)
			.filter(uniqueFilter);

		if (referencedTypeNames.length === 0) {
			return [];
		}

		return [
			importer.importType({
				filePathOrPackage:
					typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet
						? `../${contentTypeNames.folderName}/${coreConfig.barrelExportFilename}`
						: `./${coreConfig.barrelExportFilename}`,
				importValue: referencedTypeNames.join(", "),
			}),
		];
	};

	const getReferencedTaxonomyImports = (
		typeOrSnippet: Readonly<ContentTypeModels.ContentType> | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
		elements: readonly FlattenedElement[],
	): readonly string[] => {
		const taxonomyTypeNames = elements
			// only take elements that are not from snippets
			.filter((m) => !m.fromSnippet)
			.map((flattenedElement) => {
				return match(flattenedElement)
					.returnType<readonly string[] | undefined>()
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

						return [
							getTaxonomyTermCodenamesTypeName(taxonomyElement.assignedTaxonomy),
							taxonomyNames.getCodenameTypeName(taxonomyElement.assignedTaxonomy),
						];
					})
					.otherwise(() => undefined);
			})
			.filter(isNotUndefined)
			.flat()
			.filter(uniqueFilter);

		if (taxonomyTypeNames.length === 0) {
			return [];
		}

		return [
			importer.importType({
				filePathOrPackage: `../${taxonomyNames.folderName}/${coreConfig.barrelExportFilename}`,
				importValue: taxonomyTypeNames.join(", "),
			}),
		];
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
					...getCoreTypeImports(),
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
						snippets.map((snippet) => snippetNames.getEntityName(snippet)).filter(uniqueFilter),
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
		const snippets = data.flattenedElements.map((flattenedElement) => flattenedElement.fromSnippet).filter(isNotUndefined);

		return {
			imports: sortAlphabetically(
				[
					...(shouldImportCoreTypeInSnippet(data.snippet) ? getCoreTypeImports() : []),
					...getReferencedTypeImports(data.snippet, data.flattenedElements),
					...getReferencedTaxonomyImports(data.snippet, data.flattenedElements),
					...getSnippetImports(snippets),
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
				...(typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet
					? [deliveryConfig.sdkTypes.snippet]
					: [deliveryConfig.sdkTypes.contentItem]),
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

		return {
			imports: [
				importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: `${getTypeDeliverySdkImports(snippet, flattenedElements).join(", ")}`,
				}),
				...importsResult.imports,
			],
			code: `
${wrapComment(snippet.name, {
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
export type ${importsResult.typeName} = ${deliveryConfig.sdkTypes.snippet}<${nameOfTypeRepresentingAllElementCodenames},
${getElementsCode(snippet, flattenedElements)}>;

${wrapComment(`Type representing all available element codenames for ${snippet.name}`)}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)}

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

		return {
			imports: [
				importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: `${getTypeDeliverySdkImports(contentType, flattenedElements).join(", ")}`,
				}),
				...importsResult.imports,
			],
			code: `
${wrapComment(contentType.name, {
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
export type ${importsResult.typeName} = ${deliveryConfig.coreContentTypeName}<
${nameOfTypeRepresentingAllElementCodenames},
${getElementsCode(contentType, flattenedElements)}${importsResult.contentTypeExtends ? ` ${importsResult.contentTypeExtends}` : ""}, 
${contentTypeNames.getCodenameTypeName(contentType)}>

${wrapComment(`Type representing all available element codenames for ${contentType.name}`)}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)};

${wrapComment(`Type guard for ${contentType.name}`, {
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
						return getMultipleChoiceTypeCode(
							typeOrSnippet,
							multipleChoiceElement,
							multipleChoiceElement.multipleChoiceOptions ?? [],
						);
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
						value: element.guidelines ? toGuidelinesComment(element.guidelines) : "",
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

	const getContentTypeElementCodenamesType = (typeName: string, flattenedElements: readonly FlattenedElement[]): string => {
		if (flattenedElements.length === 0) {
			return `export type ${typeName} = never`;
		}
		return `export type ${typeName} = ${flattenedElements.map((element) => `'${element.codename}'`).join(" | ")};`;
	};

	const mapElementType = (typeOrSnippet: ContentTypeOrSnippet, element: FlattenedElement): string | undefined => {
		return match(element)
			.returnType<string | undefined>()
			.with({ type: "text" }, () => "TextElement")
			.with({ type: "number" }, () => "NumberElement")
			.with({ type: "modular_content" }, (linkedItemsElement) => {
				return `LinkedItemsElement<${
					linkedItemsElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "subpages" }, (linkedItemsElement) => {
				return `LinkedItemsElement<${
					linkedItemsElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "asset" }, () => "AssetsElement")
			.with({ type: "date_time" }, () => "DateTimeElement")
			.with({ type: "rich_text" }, (richTextElement) => {
				return `RichTextElement<${
					richTextElement.allowedContentTypes?.length
						? getLinkedItemsAllowedTypes(richTextElement.allowedContentTypes).join(" | ")
						: deliveryConfig.coreContentTypeName
				}>`;
			})
			.with({ type: "multiple_choice" }, (multipleChoiceElement) => {
				if (!multipleChoiceElement.multipleChoiceOptions?.length) {
					return "MultipleChoiceElement";
				}
				return `MultipleChoiceElement<${getMultipleChoiceTypeName(typeOrSnippet, multipleChoiceElement)}>`;
			})
			.with({ type: "url_slug" }, () => "UrlSlugElement")
			.with({ type: "taxonomy" }, (taxonomyElement) => {
				if (!taxonomyElement.assignedTaxonomy) {
					return "TaxonomyElement";
				}

				return `TaxonomyElement<${getTaxonomyTermCodenamesTypeName(taxonomyElement.assignedTaxonomy)}, ${taxonomyNames.getCodenameTypeName(taxonomyElement.assignedTaxonomy)}>`;
			})
			.with({ type: "custom" }, () => "CustomElement")
			.otherwise(() => undefined);
	};

	const getLinkedItemsAllowedTypes = (types: readonly Readonly<ContentTypeModels.ContentType>[]): readonly string[] => {
		if (!types.length) {
			return [deliveryConfig.sdkTypes.contentItem];
		}

		return types.map((type) => contentTypeNames.getEntityName(type));
	};

	const getContentItemTypeGuardFunction = (contentType: Readonly<ContentTypeModels.ContentType>): string => {
		const contentItemTypeName = contentTypeNames.getEntityName(contentType);
		const typeGuardFunctionName = contentTypeNames.typeNames.contentItemTypeguardFunctionName(contentType);
		const contentTypeCodename = contentTypeNames.getCodenameTypeName(contentType);

		return `export function ${typeGuardFunctionName}(item: ${deliveryConfig.sdkTypes.contentItem} | undefined | null): item is ${contentItemTypeName} {
                return item?.system.type === ('${contentType.codename}' satisfies ${contentTypeCodename});
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
