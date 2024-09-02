import chalk from 'chalk';
import {
    migrationConfig,
    coreConfig,
    getBarrelExportCode,
    ModuleResolution,
    GeneratedFile,
    getDefaultModuleResolution
} from '../../core/index.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { migrationGenerator as _migrationGenerator } from './migration.generator.js';
import { parse } from 'path';
import { Options } from 'prettier';
import { EnvironmentModels } from '@kontent-ai/management-sdk';

export interface GenerateMigrationModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleResolution: ModuleResolution;
    readonly outputDir: string;

    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration')}' models\n`);

    const { migrationItemFiles, migrationTypeFile, moduleResolution, environmentInfo } = await getFilesAsync(config);

    await createFilesAsync({
        migrationItemFiles,
        migrationTypeFile,
        moduleResolution,
        outputDir: config.outputDir,
        formatOptions: config.formatOptions,
        addTimestamp: config.addTimestamp,
        environmentInfo
    });

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFile: GeneratedFile;
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = getDefaultModuleResolution(config.moduleResolution);
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    const migrationGenerator = _migrationGenerator({
        moduleResolution: config.moduleResolution,
        environmentData: {
            environment: environmentInfo,
            taxonomies: await kontentFetcher.getTaxonomiesAsync(),
            languages: await kontentFetcher.getLanguagesAsync(),
            workflows: await kontentFetcher.getWorkflowsAsync(),
            types: await kontentFetcher.getTypesAsync(),
            snippets: await kontentFetcher.getSnippetsAsync(),
            collections: await kontentFetcher.getCollectionsAsync()
        }
    });

    return {
        moduleResolution,
        migrationTypeFile: migrationGenerator.getMigrationTypesFile(),
        migrationItemFiles: migrationGenerator.getMigrationItemFiles(),
        environmentInfo
    };
}

async function createFilesAsync(data: {
    readonly migrationTypeFile: GeneratedFile;
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly outputDir: string;
    readonly formatOptions?: Readonly<Options>;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly addTimestamp: boolean;
}): Promise<void> {
    const fileManager = _fileManager({
        outputDir: data.outputDir,
        addTimestamp: data.addTimestamp,
        environmentInfo: data.environmentInfo,
        formatOptions: data.formatOptions
    });

    await fileManager.createFilesAsync([
        data.migrationTypeFile,
        ...data.migrationItemFiles,
        // types barrel file
        {
            filename: `${migrationConfig.migrationItemsFolderName}/${coreConfig.barrelExportFilename}`,
            text: getBarrelExportCode({
                moduleResolution: data.moduleResolution,
                filenames: [
                    ...data.migrationItemFiles.map((m) => {
                        return `./${parse(m.filename).name}`;
                    })
                ]
            })
        },
        // main barrel file
        {
            filename: coreConfig.barrelExportFilename,
            text: getBarrelExportCode({
                moduleResolution: data.moduleResolution,
                filenames: [`./${migrationConfig.migrationItemsFolderName}/index`, `./${data.migrationTypeFile.filename}`]
            })
        }
    ]);
}
