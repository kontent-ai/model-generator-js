import chalk from 'chalk';
import {
    migrationConfig,
    coreConfig,
    toOutputDirPath,
    getBarrelExportCode,
    ModuleResolution
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
    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';

    const fileManager = _fileManager(toOutputDirPath(config.outputDir));
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const migrationItemsFolderName: string = migrationConfig.migrationItemsFolderName;
    const migrationTypesFilename: string = migrationConfig.migrationTypesFilename;

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

    const migrationTypeFile = migrationGenerator.getMigrationTypesFile(migrationTypesFilename);
    const migrationItemFiles = migrationGenerator.getMigrationItemFiles(
        migrationTypesFilename,
        migrationItemsFolderName
    );

    await fileManager.createFilesAsync(
        [
            migrationTypeFile,
            ...migrationItemFiles,
            // types barrel file
            {
                filename: `${migrationItemsFolderName}/${coreConfig.barrelExportFilename}`,
                text: getBarrelExportCode({
                    moduleResolution: moduleResolution,
                    filenames: [
                        ...migrationItemFiles.map((m) => {
                            return `./${parse(m.filename).name}`;
                        })
                    ]
                })
            },
            // main barrel file
            {
                filename: coreConfig.barrelExportFilename,
                text: getBarrelExportCode({
                    moduleResolution: moduleResolution,
                    filenames: [`./${migrationItemsFolderName}/index`, `./${migrationTypeFile.filename}`]
                })
            }
        ],
        config.formatOptions
    );

    console.log(chalk.green(`\nCompleted`));
}
