import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { defaultModuleResolution } from '../../config.js';
import { GeneratedSet, ModuleResolution } from '../../core/core.models.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { environmentGenerator as _environmentGenerator } from './environment.generator.js';

export interface GenerateEnvironmentModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly isEnterpriseSubscription: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateEnvironmentModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('project')}' models\n`);

    const { moduleResolution, environmentFiles: projectFiles, environmentInfo } = await getModelsAsync(config);

    const fileManager = _fileManager({
        addTimestamp: config.addTimestamp,
        environmentInfo: environmentInfo,
        formatOptions: config.formatOptions,
        outputDir: config.outputDir,
        moduleResolution: moduleResolution
    });

    await fileManager.createSetsAsync([projectFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<{
    environmentFiles: GeneratedSet;
    moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = config.moduleResolution ?? defaultModuleResolution;
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
        moduleResolution: moduleResolution
    };
}
