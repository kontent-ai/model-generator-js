import type { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import type { Options } from 'prettier';
import { defaultModuleFileExtension } from '../../config.js';
import type { CliAction, CreateFilesConfig, GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { managementKontentFetcher as _kontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { environmentGenerator as _environmentGenerator } from './environment.generator.js';

export type GenerateEnvironmentModelsConfig = {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly isEnterpriseSubscription: boolean;
    readonly apiKey: string;

    readonly moduleFileExtension: ModuleFileExtension;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
} & CreateFilesConfig;

export async function generateEnvironmentModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<readonly GeneratedFile[]> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('environment' satisfies CliAction)}' models\n`);

    const { environmentFiles, environmentInfo } = await getModelsAsync(config);

    const fileManager = _fileManager({
        ...config,
        environmentInfo: environmentInfo
    });

    const setFiles = await fileManager.getSetFilesAsync([environmentFiles]);

    if (config.createFiles) {
        fileManager.createFiles(setFiles);
    }

    console.log(chalk.green(`\nCompleted`));

    return setFiles;
}

async function getModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<{
    readonly environmentFiles: GeneratedSet;
    readonly moduleFileExtension: ModuleFileExtension;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleFileExtension: ModuleFileExtension = config.moduleFileExtension ?? defaultModuleFileExtension;
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    const [languages, taxonomies, types, snippets, collections, workflows, webooks, assetFolders, roles] = await Promise.all([
        kontentFetcher.getLanguagesAsync(),
        kontentFetcher.getTaxonomiesAsync(),
        kontentFetcher.getTypesAsync(),
        kontentFetcher.getSnippetsAsync(),
        kontentFetcher.getCollectionsAsync(),
        kontentFetcher.getWorkflowsAsync(),
        kontentFetcher.getWebhooksAsync(),
        kontentFetcher.getAssetFoldersAsync(),
        config.isEnterpriseSubscription ? kontentFetcher.getRolesAsync() : Promise.resolve([])
    ]);

    return {
        environmentInfo,
        environmentFiles: _environmentGenerator({
            environmentData: {
                environmentInfo: environmentInfo,
                languages: languages,
                taxonomies: taxonomies,
                types: types,
                workflows: workflows,
                assetFolders: assetFolders,
                collections: collections,
                roles: roles,
                snippets: snippets,
                webhooks: webooks
            }
        }).generateEnvironmentModels(),
        moduleFileExtension: moduleFileExtension
    };
}
