import type {
	CollectionModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	EnvironmentModels,
	LanguageModels,
	TaxonomyModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { syncConfig } from "../../config.js";
import { wrapComment } from "../../core/comment.utils.js";
import type { GeneratedSet, ModuleFileExtension, ObjectWithCodename } from "../../core/core.models.js";
import { sortAlphabetically, uniqueFilter } from "../../core/core.utils.js";
import { getImporter } from "../../core/importer.js";

export interface SyncGeneratorConfig {
	readonly moduleFileExtension: ModuleFileExtension;

	readonly environmentData: {
		readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
		readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
		readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
		readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
		readonly collections: readonly Readonly<CollectionModels.Collection>[];
		readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
		readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
	};
}

export function getSyncGenerator(config: SyncGeneratorConfig) {
	const importer = getImporter(config.moduleFileExtension);

	return {
		getSyncFiles(): GeneratedSet {
			return {
				folderName: undefined,
				files: [
					{
						filename: `${syncConfig.coreTypesFilename}.ts`,
						text: `
				${importer.importType({
					filePathOrPackage: syncConfig.npmPackageName,
					importValue: [syncConfig.sdkTypes.syncClientTypes, syncConfig.sdkTypes.syncClient],
				})}

                ${wrapComment("Use as generic type when creating a sync client for increased type safety")}
				export type ${syncConfig.coreClientTypesTypeName} = ${syncConfig.sdkTypes.syncClientTypes} & {
					readonly languageCodenames: ${getCodenames(config.environmentData.languages)},
					readonly typeCodenames: ${getCodenames(config.environmentData.types)},
					readonly workflowCodenames: ${getCodenames(config.environmentData.workflows)},
					readonly workflowStepCodenames: ${getCodenames(config.environmentData.workflows.flatMap((workflow) => workflow.steps))},
					readonly collectionCodenames: ${getCodenames(config.environmentData.collections)},
					readonly taxonomyCodenames: ${getCodenames(config.environmentData.taxonomies)},
				};

				${wrapComment("Type safe sync client")}
				export type ${syncConfig.coreClientTypeName} = SyncClient<${syncConfig.coreClientTypesTypeName}>;
				`,
					},
				],
			};
		},
	};
}

function getCodenames(items: readonly ObjectWithCodename[]): string {
	if (!items.length) {
		return "never";
	}
	return sortAlphabetically(items.map((item) => `'${item.codename}'`).filter(uniqueFilter), (m) => m).join(" | ");
}
