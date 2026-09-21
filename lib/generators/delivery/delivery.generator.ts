import type {
	CollectionModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	EnvironmentModels,
	LanguageModels,
	TaxonomyModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { deliveryConfig } from "../../config.js";
import { wrapComment } from "../../core/comment.utils.js";
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from "../../core/core.models.js";
import { isNotUndefined, uniqueFilter } from "../../core/core.utils.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { getImporter } from "../../core/importer.js";
import type { FilenameResolver, NameResolver } from "../../core/resolvers.js";
import { type DeliveryElement, getDeliveryEntityGenerator } from "./delivery-entity.generator.js";
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

		return flattenedElements
			.filter((element) => uniqueElementCodenames.includes(element.codename))
			.map<DeliveryElement>((m) => ({
				codename: m.codename,
				name: m.title,
				externalId: m.externalId,
			}));
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

		const getTypeElementCodenames = (type: Readonly<ContentTypeModels.ContentType>): readonly string[] =>
			getFlattenedElements({
				elements: type.elements,
				snippets: config.environmentData.snippets,
				taxonomies: config.environmentData.taxonomies,
				types: config.environmentData.types,
			}).map((element) => element.codename);

		const workflowStepCodenames: readonly string[] = config.environmentData.workflows
			.flatMap((workflow) =>
				[...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined),
			)
			.map((step) => step.codename);

		const taxonomiesMap: string = config.environmentData.taxonomies
			.map((taxonomy) => `readonly ${taxonomy.codename}: ${formatTuple(deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms))};`)
			.join("\n");

		const contentTypesMap: string = config.environmentData.types
			.map((type) => `readonly ${type.codename}: ${formatTuple(getTypeElementCodenames(type))};`)
			.join("\n");

		return {
			filename: `${deliveryConfig.mainSystemFilename}.ts`,
			text: `
              ${importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: [deliveryConfig.sdkTypes.deliveryClient, deliveryConfig.sdkTypes.deliveryClientSchema],
				})}

                ${wrapComment(`Schema describing this environment, used to strongly type '${deliveryConfig.sdkTypes.deliveryClient}'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.coreClientSchemaTypeName} = ${deliveryConfig.sdkTypes.deliveryClientSchema}<{
                    readonly languageCodenames: ${formatTuple(config.environmentData.languages.map((language) => language.codename))};
                    readonly taxonomies: {
                        ${taxonomiesMap}
                    };
                    readonly contentTypes: {
                        ${contentTypesMap}
                    };
                    readonly collectionCodenames: ${formatTuple(config.environmentData.collections.map((collection) => collection.codename))};
                    readonly workflowCodenames: ${formatTuple(config.environmentData.workflows.map((workflow) => workflow.codename))};
                    readonly workflowStepCodenames: ${formatTuple(workflowStepCodenames)};
                }>;

                ${wrapComment(`Typed delivery client. Use this instead of '${deliveryConfig.sdkTypes.deliveryClient}'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.coreDeliveryClientTypeName} = ${deliveryConfig.sdkTypes.deliveryClient}<${deliveryConfig.coreClientSchemaTypeName}>;
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
