import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { coreConfig, defaultModuleResolution, migrationConfig } from '../../config.js';
import { GeneratedFile, ModuleResolution } from '../../core/core.models.js';
import { getFilenameFromPath } from '../../core/core.utils.js';
import { importer as _importer } from '../../core/importer.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { migrationGenerator as _migrationGenerator } from './migration.generator.js';

export interface GenerateMigrationModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleResolution: ModuleResolution;

    readonly outputDir?: string;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration')}' models\n`);

    const { migrationItemFiles, migrationTypeFiles, moduleResolution, environmentInfo, environmentFiles } = await getFilesAsync(config);

    await createFilesAsync({
        migrationItemFiles,
        environmentFiles,
        migrationTypeFiles,
        moduleResolution,
        outputDir: config.outputDir,
        formatOptions: config.formatOptions,
        addTimestamp: config.addTimestamp,
        environmentInfo
    });

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFiles: readonly GeneratedFile[];
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly environmentFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = config.moduleResolution ?? defaultModuleResolution;
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    const [languages, taxonomies, types, snippets, collections, workflows] = await Promise.all([
        kontentFetcher.getLanguagesAsync(),
        kontentFetcher.getTaxonomiesAsync(),
        kontentFetcher.getTypesAsync(),
        kontentFetcher.getSnippetsAsync(),
        kontentFetcher.getCollectionsAsync(),
        kontentFetcher.getWorkflowsAsync()
    ]);

    const migrationGenerator = _migrationGenerator({
        moduleResolution: config.moduleResolution,
        environmentData: {
            environment: environmentInfo,
            taxonomies: taxonomies,
            languages: languages,
            workflows: workflows,
            types: types,
            snippets: snippets,
            collections: collections
        }
    });

    return {
        moduleResolution,
        migrationTypeFiles: migrationGenerator.getMigrationTypeFiles(),
        migrationItemFiles: migrationGenerator.getMigrationItemFiles(),
        environmentFiles: migrationGenerator.getEnvironmentFiles(),
        environmentInfo
    };
}

async function createFilesAsync(data: {
    readonly migrationTypeFiles: readonly GeneratedFile[];
    readonly environmentFiles: readonly GeneratedFile[];
    readonly migrationItemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly outputDir?: string;
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

    const importer = _importer(data.moduleResolution);

    await fileManager.createFilesAsync([
        ...data.migrationTypeFiles,
        ...data.environmentFiles,
        ...data.migrationItemFiles,
        // items barrel file
        {
            filename: `${migrationConfig.migrationItemsFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.migrationItemFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        // environment barrel file
        {
            filename: `${migrationConfig.environmentFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.environmentFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        // main barrel file
        {
            filename: coreConfig.barrelExportFilename,
            text: importer.getBarrelExportCode([
                `./${migrationConfig.migrationItemsFolderName}/index`,
                `./${migrationConfig.environmentFolderName}/index`,
                ...data.migrationTypeFiles.map((file) => `./${file.filename}`)
            ])
        }
    ]);
}
