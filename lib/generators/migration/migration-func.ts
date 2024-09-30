import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { defaultModuleResolution } from '../../config.js';
import { GeneratedSet, ModuleResolution } from '../../core/core.models.js';
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

    const fileManager = _fileManager({
        outputDir: config.outputDir,
        addTimestamp: config.addTimestamp,
        environmentInfo: environmentInfo,
        formatOptions: config.formatOptions,
        moduleResolution: moduleResolution
    });

    await fileManager.createSetsAsync([migrationItemFiles, migrationTypeFiles, environmentFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFiles: GeneratedSet;
    readonly migrationItemFiles: GeneratedSet;
    readonly environmentFiles: GeneratedSet;
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
