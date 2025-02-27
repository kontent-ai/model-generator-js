import type { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import type { Options } from 'prettier';
import type { CliAction, CreateFilesConfig, GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { getManagementKontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { getFileManager } from '../../files/file-manager.js';
import { getMigrationGenerator } from './migration.generator.js';

export type GenerateMigrationModelsConfig = {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleFileExtension: ModuleFileExtension;

    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
} & CreateFilesConfig;

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<readonly GeneratedFile[]> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration-toolkit' satisfies CliAction)}' models\n`);

    const { migrationItemFiles, migrationTypeFiles, environmentInfo, environmentFiles } = await getFilesAsync(config);

    const fileManager = getFileManager({
        ...config,
        environmentInfo
    });

    const setFiles = await fileManager.getSetFilesAsync([migrationItemFiles, migrationTypeFiles, environmentFiles]);

    if (config.createFiles) {
        fileManager.createFiles(setFiles);
    }

    console.log(chalk.green(`\nCompleted`));

    return setFiles;
}

async function getFilesAsync(config: GenerateMigrationModelsConfig): Promise<{
    readonly migrationTypeFiles: GeneratedSet;
    readonly migrationItemFiles: GeneratedSet;
    readonly environmentFiles: GeneratedSet;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const kontentFetcher = getManagementKontentFetcher({
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

    const migrationGenerator = getMigrationGenerator({
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
