import type { EnvironmentModels } from "@kontent-ai/management-sdk";
import chalk from "chalk";
import type { Options } from "prettier";
import {
	type CliAction,
	type CreateFilesConfig,
	type EnvironmentEntity,
	environmentEntities,
	type GeneratedFile,
	type GeneratedSet,
	type ModuleFileExtension,
} from "../../core/core.models.js";
import { uniqueFilter } from "../../core/core.utils.js";
import { getManagementKontentFetcher, type ManagementKontentFetcher } from "../../fetch/management-kontent-fetcher.js";
import { getFileManager } from "../../files/file-manager.js";
import { type EnvironmentEntities, getEnvironmentGenerator } from "./environment.generator.js";

export type GenerateEnvironmentModelsConfig = {
	readonly environmentId: string;
	readonly addTimestamp: boolean;
	readonly managementApiKey: string;

	readonly entities?: readonly EnvironmentEntity[];
	readonly moduleFileExtension: ModuleFileExtension;
	readonly managementBaseUrl?: string;
	readonly formatOptions?: Readonly<Options>;
} & CreateFilesConfig;

export async function generateEnvironmentModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<readonly GeneratedFile[]> {
	console.log(chalk.green("Model generator started \n"));
	console.log(`Generating '${chalk.yellow("environment" satisfies CliAction)}' models\n`);

	const { environmentFiles, environmentInfo } = await getFilesAsync(config);

	const fileManager = getFileManager({
		...config,
		environmentInfo,
	});

	const setFiles = await fileManager.getSetFilesAsync([environmentFiles]);

	if (config.createFiles) {
		fileManager.createFiles(setFiles);
	}

	console.log(chalk.green("\nCompleted"));

	return setFiles;
}

async function getFilesAsync(config: GenerateEnvironmentModelsConfig): Promise<{
	readonly environmentFiles: GeneratedSet;
	readonly moduleFileExtension: ModuleFileExtension;
	readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
	const kontentFetcher = getManagementKontentFetcher({
		environmentId: config.environmentId,
		managementApiKey: config.managementApiKey,
		baseUrl: config.managementBaseUrl,
	});

	const entitiesToCreate: readonly EnvironmentEntity[] = config.entities ?? environmentEntities; // default to all entities export

	const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();
	const entities = await getEntitiesAsync({
		kontentFetcher,
		entitiesConfig: entitiesToCreate,
	});

	return {
		environmentInfo,
		environmentFiles: getEnvironmentGenerator({
			environmentInfo,
			environmentEntities: entities,
			entitiesToCreate: entitiesToCreate,
		}).generateEnvironmentModels(),
		moduleFileExtension: config.moduleFileExtension,
	};
}

async function getEntitiesAsync({
	kontentFetcher,
	entitiesConfig,
}: {
	kontentFetcher: ManagementKontentFetcher;
	entitiesConfig: readonly EnvironmentEntity[];
}): Promise<EnvironmentEntities> {
	const entitiesToFetch = getEntitiesToFetchFromApi(entitiesConfig);

	const [
		languages,
		taxonomies,
		contentTypes,
		snippets,
		collections,
		workflows,
		webhooks,
		assetFolders,
		roles,
		customApps,
		spaces,
		previewUrls,
	] = await Promise.all([
		fetchEntity({ canFetch: () => entitiesToFetch.includes("languages"), fetch: () => kontentFetcher.getLanguagesAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("taxonomies"), fetch: () => kontentFetcher.getTaxonomiesAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("contentTypes"), fetch: () => kontentFetcher.getTypesAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("snippets"), fetch: () => kontentFetcher.getSnippetsAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("collections"), fetch: () => kontentFetcher.getCollectionsAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("workflows"), fetch: () => kontentFetcher.getWorkflowsAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("webhooks"), fetch: () => kontentFetcher.getWebhooksAsync() }),
		fetchEntity({
			canFetch: () => entitiesToFetch.includes("assetFolders"),
			fetch: () => kontentFetcher.getAssetFoldersAsync(),
		}),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("roles"), fetch: () => kontentFetcher.getRolesAsync() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("customApps"), fetch: () => kontentFetcher.getCustomApps() }),
		fetchEntity({ canFetch: () => entitiesToFetch.includes("spaces"), fetch: () => kontentFetcher.getSpaces() }),
		fetchEntity({
			canFetch: () => entitiesToFetch.includes("previewUrls"),
			fetch: () => kontentFetcher.getPreviewUrlConfiguration(),
		}),
	]);

	return {
		assetFolders,
		collections,
		languages,
		roles,
		snippets,
		taxonomies,
		contentTypes,
		webhooks,
		workflows,
		customApps,
		previewUrls,
		spaces,
	};
}

function getEntitiesToFetchFromApi(entityTypes: readonly EnvironmentEntity[]): readonly EnvironmentEntity[] {
	return (
		[
			...entityTypes,
			// when requesting snippets or content types, we need to fetch taxonomies & (snippets or types) as well
			// this is is because we need these entities to narrow down types for elements
			...(entityTypes.includes("contentTypes") || entityTypes.includes("snippets")
				? (["taxonomies", "snippets", "contentTypes"] satisfies readonly EnvironmentEntity[])
				: []),
			// when requesting preview urls, we need to fetch spaces & content types as well
			...(entityTypes.includes("previewUrls") ? (["spaces", "contentTypes"] satisfies readonly EnvironmentEntity[]) : []),
		] satisfies readonly EnvironmentEntity[]
	).filter(uniqueFilter);
}

function fetchEntity<T>({
	canFetch,
	fetch,
}: {
	canFetch: () => boolean;
	fetch: () => Promise<(T extends Array<T> ? readonly Array<T>[] : T) | undefined>;
}): Promise<(T extends Array<T> ? readonly Array<T>[] : T) | undefined> {
	if (!canFetch()) {
		return Promise.resolve(undefined);
	}
	return fetch();
}
