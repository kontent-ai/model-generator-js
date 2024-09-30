import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { coreConfig, defaultModuleResolution } from '../../config.js';
import { GeneratedFile, ModuleResolution } from '../../core/core.models.js';
import { getFilenameFromPath } from '../../core/core.utils.js';
import { importer as _importer } from '../../core/importer.js';
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

    await createFilesAsync({
        moduleResolution,
        projectFiles,
        outputDir: config.outputDir,
        formatOptions: config.formatOptions,
        addTimestamp: config.addTimestamp,
        environmentInfo
    });

    console.log(chalk.green(`\nCompleted`));
}

async function getModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<{
    environmentFiles: readonly GeneratedFile[];
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

async function createFilesAsync(data: {
    readonly projectFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly outputDir?: string;
    readonly addTimestamp: boolean;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly formatOptions?: Readonly<Options>;
}): Promise<void> {
    const fileManager = _fileManager({
        addTimestamp: data.addTimestamp,
        environmentInfo: data.environmentInfo,
        formatOptions: data.formatOptions,
        outputDir: data.outputDir
    });

    const importer = _importer(data.moduleResolution);

    await fileManager.createFilesAsync([
        ...data.projectFiles,
        // barrel file
        {
            filename: coreConfig.barrelExportFilename,
            text: importer.getBarrelExportCode([
                ...data.projectFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        }
    ]);
}
