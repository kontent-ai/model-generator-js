import type { EnvironmentModels } from "@kontent-ai/management-sdk";
import chalk from "chalk";
import type { CliAction, CreateFilesConfig, GeneratedFile, GeneratedSet, ModuleFileExtension } from "../../core/core.models.js";
import { getManagementKontentFetcher } from "../../fetch/management-kontent-fetcher.js";
import { getFileManager } from "../../files/file-manager.js";
import type { FormatOptions } from "../../format/formatter.js";
import { getSyncGenerator } from "./sync.generator.js";

export type GenerateSyncModelsConfig = {
	readonly environmentId: string;
	readonly addTimestamp: boolean;
	readonly managementApiKey: string;
	readonly moduleFileExtension: ModuleFileExtension;

	readonly managementBaseUrl?: string;
	readonly formatOptions?: FormatOptions;
	readonly disableComments?: boolean;
} & CreateFilesConfig;

export async function generateSyncModelsAsync(config: GenerateSyncModelsConfig): Promise<readonly GeneratedFile[]> {
	console.log(chalk.green("Model generator started \n"));
	console.log(`Generating '${chalk.yellow("sync-sdk" satisfies CliAction)}' models\n`);

	const { syncFiles, environmentInfo } = await getFilesAsync(config);

	const fileManager = getFileManager({
		disableComments: config.disableComments ?? false,
		...config,
		environmentInfo,
	});

	const setFiles = await fileManager.getSetFilesAsync([syncFiles]);

	if (config.createFiles) {
		fileManager.createFiles(setFiles);
	}

	console.log(chalk.green("\nCompleted"));

	return setFiles;
}

async function getFilesAsync(config: GenerateSyncModelsConfig): Promise<{
	readonly syncFiles: GeneratedSet;
	readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
	const kontentFetcher = getManagementKontentFetcher({
		environmentId: config.environmentId,
		managementApiKey: config.managementApiKey,
		baseUrl: config.managementBaseUrl,
	});

	const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

	const [languages, taxonomies, types, snippets, collections, workflows] = await Promise.all([
		kontentFetcher.getLanguagesAsync(),
		kontentFetcher.getTaxonomiesAsync(),
		kontentFetcher.getTypesAsync(),
		kontentFetcher.getSnippetsAsync(),
		kontentFetcher.getCollectionsAsync(),
		kontentFetcher.getWorkflowsAsync(),
	]);

	const syncGenerator = getSyncGenerator({
		moduleFileExtension: config.moduleFileExtension,
		disableComments: config.disableComments ?? false,
		environmentData: {
			environment: environmentInfo,
			taxonomies: taxonomies,
			languages: languages,
			workflows: workflows,
			types: types,
			snippets: snippets,
			collections: collections,
		},
	});

	return {
		syncFiles: syncGenerator.getSyncFiles(),
		environmentInfo,
	};
}
