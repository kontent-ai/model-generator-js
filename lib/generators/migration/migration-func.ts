import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { managementKontentFetcher as _kontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { migrationGenerator as _migrationGenerator } from './migration.generator.js';

export interface GenerateMigrationModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleFileExtension: ModuleFileExtension;

    readonly outputDir?: string;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration')}' models\n`);

    const { migrationItemFiles, migrationTypeFiles, environmentInfo, environmentFiles } = await getFilesAsync(config);

    const fileManager = _fileManager({
        ...config,
        environmentInfo: environmentInfo
    });

    await fileManager.createSetsAsync([migrationItemFiles, migrationTypeFiles, environmentFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFiles: GeneratedSet;
    readonly migrationItemFiles: GeneratedSet;
    readonly environmentFiles: GeneratedSet;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
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
        moduleFileExtension: config.moduleFileExtension,
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
        migrationTypeFiles: migrationGenerator.getMigrationTypeFiles(),
        migrationItemFiles: migrationGenerator.getMigrationItemFiles(),
        environmentFiles: migrationGenerator.getEnvironmentFiles(),
        environmentInfo
    };
}
