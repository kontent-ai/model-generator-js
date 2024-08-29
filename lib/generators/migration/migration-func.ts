import chalk from 'chalk';
import {
    migrationConfig,
    coreConfig,
    toOutputDirPath,
    getBarrelExportCode,
    ModuleResolution,
    GeneratedFile
} from '../../core/index.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { migrationGenerator as _migrationGenerator } from './migration.generator.js';
import { parse } from 'path';
import { Options } from 'prettier';

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

    const { migrationItemFiles, migrationTypeFile, moduleResolution } = await getFilesAsync(config);

    await createFilesAsync({
        migrationItemFiles,
        migrationTypeFile,
        moduleResolution,
        outputDir: config.outputDir,
        formatOptions: config.formatOptions
    });

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFile: GeneratedFile;
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
}> {
    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const projectInformation = await kontentFetcher.getEnvironmentInfoAsync();

    const migrationGenerator = _migrationGenerator({
        addTimestamp: config.addTimestamp,
        moduleResolution: config.moduleResolution,
        environmentData: {
            environment: projectInformation,
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
        migrationItemFiles: migrationGenerator.getMigrationItemFiles()
    };
}

async function createFilesAsync(data: {
    readonly migrationTypeFile: GeneratedFile;
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly outputDir: string;
    readonly formatOptions?: Readonly<Options>;
}): Promise<void> {
    const fileManager = _fileManager(toOutputDirPath(data.outputDir));

    await fileManager.createFilesAsync(
        [
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
                    filenames: [
                        `./${migrationConfig.migrationItemsFolderName}/index`,
                        `./${data.migrationTypeFile.filename}`
                    ]
                })
            }
        ],
        data.formatOptions
    );
}
