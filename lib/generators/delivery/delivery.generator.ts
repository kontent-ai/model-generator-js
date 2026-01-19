import type {
	CollectionModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	EnvironmentModels,
	LanguageModels,
	TaxonomyModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { match } from "ts-pattern";
import { deliveryConfig } from "../../config.js";
import { wrapComment } from "../../core/comment.utils.js";
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from "../../core/core.models.js";
import { isNotUndefined, uniqueFilter } from "../../core/core.utils.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { getImporter } from "../../core/importer.js";
import type { FilenameResolver, NameResolver } from "../../core/resolvers.js";
import type { DeliveryElement } from "./delivery-entity.generator.js";
import { getDeliveryEntityGenerator } from "./delivery-entity.generator.js";

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
		const sdkImports = [deliveryConfig.sdkTypes.deliveryClient] as const;

		return {
			filename: `${deliveryConfig.mainSystemFilename}.ts`,
			text: `
              ${importer.importType({
					filePathOrPackage: deliveryConfig.npmPackageName,
					importValue: `${sdkImports.join(", ")}`,
				})}
                ${Object.values(entityGenerators)
					.filter((generator) => generator.entityType !== "Snippet")
					.map((generator) => {
						const importValues: readonly string[] = match(generator.entityType)
							.with("Workflow", () => [
								generator.entityNames.codenamesTypeName,
								entityGenerators.workflows.entityNames.allStepsNames.codenamesTypeName,
							])
							.with("Type", () => [generator.entityNames.codenamesTypeName, deliveryConfig.coreContentTypeName])
							.otherwise(() => [generator.entityNames.codenamesTypeName]);

						return importer.importType({
							filePathOrPackage: `./${generator.entityNames.overviewFilename}`,
							importValue: `${importValues.join(", ")}`,
						});
					})
					.join("\n")}          

                ${wrapComment(`Core types for '${deliveryConfig.sdkTypes.deliveryClient}'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.coreDeliveryClientTypesTypeName} = {
                    readonly collectionCodenames: ${entityGenerators.collections.entityNames.codenamesTypeName};
                    readonly contentItemType: ${deliveryConfig.coreContentTypeName};
                    readonly contentTypeCodenames: ${entityGenerators.contentTypes.entityNames.codenamesTypeName};
                    readonly elementCodenames: ${entityGenerators.elements.entityNames.codenamesTypeName};
                    readonly languageCodenames: ${entityGenerators.languages.entityNames.codenamesTypeName};
                    readonly taxonomyCodenames: ${entityGenerators.taxonomies.entityNames.codenamesTypeName};
                    readonly workflowCodenames: ${entityGenerators.workflows.entityNames.codenamesTypeName};
                    readonly workflowStepCodenames: ${entityGenerators.workflows.entityNames.allStepsNames.codenamesTypeName};
                };

                ${wrapComment(`Typed delivery client. Use this instead of '${deliveryConfig.sdkTypes.deliveryClient}'`, { disableComments: config.disableComments })}
                export type ${deliveryConfig.coreDeliveryClientTypeName} = IDeliveryClient<${deliveryConfig.coreDeliveryClientTypesTypeName}>;
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
