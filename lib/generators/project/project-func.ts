import chalk from 'chalk';
import { projectGenerator as _projectGenerator } from './project.generator.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import {
    coreConfig,
    GeneratedFile,
    getBarrelExportCode,
    getDefaultModuleResolution,
    getFilenameFromPath,
    ModuleResolution
} from '../../core/index.js';
import { Options } from 'prettier';
import { EnvironmentModels } from '@kontent-ai/management-sdk';

export interface GenerateProjectModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly isEnterpriseSubscription: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateProjectModelsAsync(config: GenerateProjectModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('project')}' models\n`);

    const { moduleResolution, projectFiles, environmentInfo } = await getModelsAsync(config);

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

async function getModelsAsync(config: GenerateProjectModelsConfig): Promise<{
    projectFiles: readonly GeneratedFile[];
    moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = getDefaultModuleResolution(config.moduleResolution);
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    return {
        environmentInfo,
        projectFiles: _projectGenerator({
            environmentData: {
                environmentInfo: environmentInfo,
                languages: await kontentFetcher.getLanguagesAsync(),
                taxonomies: await kontentFetcher.getTaxonomiesAsync(),
                types: await kontentFetcher.getTypesAsync(),
                workflows: await kontentFetcher.getWorkflowsAsync(),
                assetFolders: await kontentFetcher.getAssetFoldersAsync(),
                collections: await kontentFetcher.getCollectionsAsync(),
                roles: config.isEnterpriseSubscription ? await kontentFetcher.getRolesAsync() : [],
                snippets: await kontentFetcher.getSnippetsAsync(),
                webhooks: await kontentFetcher.getWebhooksAsync()
            }
        }).generateProjectModel(),
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

    await fileManager.createFilesAsync([
        ...data.projectFiles,
        // barrel file
        {
            filename: coreConfig.barrelExportFilename,
            text: getBarrelExportCode({
                moduleResolution: data.moduleResolution,
                filenames: [
                    ...data.projectFiles.map((m) => {
                        return `./${getFilenameFromPath(m.filename)}`;
                    })
                ]
            })
        }
    ]);
}
