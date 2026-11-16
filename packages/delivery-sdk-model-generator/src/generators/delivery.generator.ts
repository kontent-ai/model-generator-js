import type {
	CollectionModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	EnvironmentModels,
	LanguageModels,
	TaxonomyModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import {
	type FilenameResolver,
	type FlattenedElement,
	type GeneratedFile,
	type GeneratedSet,
	getFlattenedElements,
	getImporter,
	getWorkflowSteps,
	isNotUndefined,
	type ModuleFileExtension,
	type NameResolver,
	uniqueFilter,
	wrapComment,
} from "@kontent-ai/model-generator-shared";
import { match, P } from "ts-pattern";
import { deliveryConfig } from "../config.js";
import { type DeliveryElement, getDeliveryEntityGenerator } from "./delivery-entity.generator.js";
import { getDeliveryEntityNamesGenerator } from "./delivery-entity-name.generator.js";
import { deliveryEntityUtils } from "./utils/delivery-entity.utils.js";

export type DeliveryFileResolvers = {
	readonly contentType?: FilenameResolver<ContentTypeModels.ContentType>;
	readonly snippet?: FilenameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
	readonly taxonomy?: FilenameResolver<TaxonomyModels.Taxonomy>;
	readonly language?: FilenameResolver<LanguageModels.LanguageModel>;
	readonly collection?: FilenameResolver<CollectionModels.Collection>;
	readonly workflow?: FilenameResolver<WorkflowModels.Workflow>;
};

export type DeliveryNameResolvers = {
	readonly contentType?: NameResolver<ContentTypeModels.ContentType>;
	readonly snippet?: NameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
	readonly taxonomy?: NameResolver<TaxonomyModels.Taxonomy>;
	readonly language?: NameResolver<LanguageModels.LanguageModel>;
	readonly collection?: NameResolver<CollectionModels.Collection>;
	readonly workflow?: NameResolver<WorkflowModels.Workflow>;
};

export interface DeliveryGeneratorConfig {
	readonly moduleFileExtension: ModuleFileExtension;
	readonly disableComments: boolean;

	readonly environmentData: {
		readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
		readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
		readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
		readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
		readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
		readonly collections: readonly Readonly<CollectionModels.Collection>[];
		readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
	};

	readonly fileResolvers?: DeliveryFileResolvers;
	readonly nameResolvers?: DeliveryNameResolvers;
}

export function deliveryGenerator(config: DeliveryGeneratorConfig) {
	const importer = getImporter(config.moduleFileExtension);

	const getUniqueDeliveryElements = (): readonly Readonly<DeliveryElement>[] => {
		const flattenedElements = getFlattenedElements({
			elements: [
				...config.environmentData.types.flatMap((type) => type.elements),
				...config.environmentData.snippets.flatMap((snippet) => snippet.elements),
			],
			snippets: config.environmentData.snippets,
			taxonomies: config.environmentData.taxonomies,
			types: config.environmentData.types,
		});

		const uniqueElementCodenames: readonly string[] = flattenedElements
			.map((element) => element.codename)
			.filter(isNotUndefined)
			.filter(uniqueFilter);

		return uniqueElementCodenames
			.map((codename) => {
				return flattenedElements.find((m) => m.codename === codename);
			})
			.filter(isNotUndefined)
			.map<Readonly<DeliveryElement>>((flattenedElement) => {
				return {
					codename: flattenedElement.codename,
					externalId: flattenedElement.externalId,
					name: flattenedElement.title,
				};
			});
	};

	const entityGenerators = {
		collections: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.collections,
			entityType: "Collection",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		languages: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.languages,
			entityType: "Language",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		workflows: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.workflows,
			entityType: "Workflow",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		taxonomies: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.taxonomies,
			entityType: "Taxonomy",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		contentTypes: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.types,
			entityType: "Type",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		snippets: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: config.environmentData.snippets,
			entityType: "Snippet",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: false,
			deliveryGeneratorConfig: config,
		}),
		elements: getDeliveryEntityGenerator({
			disableComments: config.disableComments,
			entities: getUniqueDeliveryElements(),
			entityType: "Element",
			moduleFileExtension: config.moduleFileExtension,
			generateOnlyOverviewFile: true,
			deliveryGeneratorConfig: config,
		}),
	};

	const getDeliverySystemFile = (): GeneratedFile => {
		const deliveryUtils = deliveryEntityUtils();

		const formatTuple = (codenames: readonly string[]): string =>
			`readonly [${[...new Set(codenames)].map((codename) => `"${codename}"`).join(", ")}]`;

		const typeOverviewFilename = getDeliveryEntityNamesGenerator({
			nameResolvers: config.nameResolvers,
			fileResolvers: config.fileResolvers,
			entityType: "Type",
		}).getEntityNames().overviewFilename;

		const getElementSchemaCode = (element: FlattenedElement): string | undefined => {
			const elementSchema = match(element)
				.returnType<string | undefined>()
				.with({ type: "multiple_choice" }, (multipleChoiceElement) => {
					const options = (multipleChoiceElement.multipleChoiceOptions ?? [])
						.map((option) => option.codename)
						.filter((codename): codename is string => !!codename);

					return `{ readonly type: "multiple_choice"; readonly options: ${options.length ? formatTuple(options) : "readonly string[]"} }`;
				})
				.with({ type: "taxonomy" }, (taxonomyElement) => {
					return `{ readonly type: "taxonomy"; readonly taxonomyGroup: ${taxonomyElement.assignedTaxonomy ? `"${taxonomyElement.assignedTaxonomy.codename}"` : "string"} }`;
				})
				// subpages are delivered as linked items
				.with({ type: "subpages" }, () => `{ readonly type: "modular_content" }`)
				.with(
					{ type: P.union("text", "number", "rich_text", "date_time", "asset", "url_slug", "custom", "modular_content") },
					(simpleElement) => `{ readonly type: "${simpleElement.type}" }`,
				)
				.otherwise(() => undefined);

			return elementSchema ? `readonly ${element.codename}: ${elementSchema};` : undefined;
		};

		const getTypeElements = (type: Readonly<ContentTypeModels.ContentType>): readonly FlattenedElement[] =>
			getFlattenedElements({
				elements: type.elements,
				snippets: config.environmentData.snippets,
				taxonomies: config.environmentData.taxonomies,
				types: config.environmentData.types,
			}).filter((element, index, elements) => elements.findIndex((m) => m.codename === element.codename) === index);

		const workflowsMap: string = config.environmentData.workflows
			.map(
				(workflow) =>
					`readonly ${workflow.codename}: ${formatTuple(
						getWorkflowSteps(workflow)
							.map((step) => step.codename)
							.filter(uniqueFilter),
					)};`,
			)
			.join("\n");

		const taxonomiesMap: string = config.environmentData.taxonomies
			.map((taxonomy) => `readonly ${taxonomy.codename}: ${formatTuple(deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms))};`)
			.join("\n");

		const getElementsSchemaCode = (type: Readonly<ContentTypeModels.ContentType>): string => {
			const elementsCode = getTypeElements(type)
				.map((element) => getElementSchemaCode(element))
				.filter(isNotUndefined);

			return elementsCode.length ? `{\n${elementsCode.join("\n")}\n}` : "Record<string, never>";
		};

		const contentTypesMap: string = config.environmentData.types
			.map((type) => `readonly ${type.codename}: ${getElementsSchemaCode(type)};`)
			.join("\n");

		return {
			filename: `${deliveryConfig.mainSystemFilename}.ts`,
			text: `
              ${importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: [deliveryConfig.sdkTypes.deliveryClient, deliveryConfig.sdkTypes.deliveryClientSchema],
				})}
              ${importer.importType({
					filePathOrPackage: `./${typeOverviewFilename}`,
					importValue: [deliveryConfig.typedItemTypeName],
				})}

                ${wrapComment(`Schema describing this environment, used to strongly type '${deliveryConfig.sdkTypes.deliveryClient}'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.typedClientSchemaTypeName} = ${deliveryConfig.sdkTypes.deliveryClientSchema}<{
                    readonly languageCodenames: ${formatTuple(config.environmentData.languages.map((language) => language.codename))};
                    readonly collectionCodenames: ${formatTuple(config.environmentData.collections.map((collection) => collection.codename))};
                    readonly taxonomies: {
                        ${taxonomiesMap}
                    };
                    readonly workflows: {
                        ${workflowsMap}
                    };
                    readonly contentTypes: {
                        ${contentTypesMap}
                    };
                }>;

                ${wrapComment(`Typed delivery client. Responses are typed with '${deliveryConfig.typedItemTypeName}'. Create it with 'createDeliveryClient<${deliveryConfig.typedClientSchemaTypeName}, ${deliveryConfig.typedItemTypeName}>(...)'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.typedDeliveryClientTypeName} = ${deliveryConfig.sdkTypes.deliveryClient}<${deliveryConfig.typedClientSchemaTypeName}, ${deliveryConfig.typedItemTypeName}>;
            `,
		};
	};

	return {
		getTypeFiles: (): readonly GeneratedSet[] => {
			return Object.values(entityGenerators).map((generator) => generator.generateEntityTypes());
		},
		getSystemFiles(): GeneratedSet {
			return {
				folderName: deliveryConfig.systemTypesFolderName,
				files: [getDeliverySystemFile(), ...Object.values(entityGenerators).map((generator) => generator.generateOverviewFile())],
			};
		},
	};
}
