import type { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import type { Options } from 'prettier';
import { match } from 'ts-pattern';
import { defaultModuleFileExtension } from '../../config.js';
import {
    environmentEntities,
    type CliAction,
    type CreateFilesConfig,
    type EnvironmentEntity,
    type GeneratedFile,
    type GeneratedSet,
    type ModuleFileExtension
} from '../../core/core.models.js';
import { uniqueFilter } from '../../core/core.utils.js';
import { managementKontentFetcher as _kontentFetcher, type ManagementKontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { environmentGenerator as _environmentGenerator, type EnvironmentEntities } from './environment.generator.js';

export type GenerateEnvironmentModelsConfig = {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;

    readonly entities?: readonly EnvironmentEntity[];
    readonly moduleFileExtension: ModuleFileExtension;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
} & CreateFilesConfig;

export async function generateEnvironmentModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<readonly GeneratedFile[]> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('environment' satisfies CliAction)}' models\n`);

    const { environmentFiles, environmentInfo } = await getModelsAsync(config);

    const fileManager = _fileManager({
        ...config,
        environmentInfo
    });

    const setFiles = await fileManager.getSetFilesAsync([environmentFiles]);

    if (config.createFiles) {
        fileManager.createFiles(setFiles);
    }

    console.log(chalk.green(`\nCompleted`));

    return setFiles;
}

async function getModelsAsync(config: GenerateEnvironmentModelsConfig): Promise<{
    readonly environmentFiles: GeneratedSet;
    readonly moduleFileExtension: ModuleFileExtension;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleFileExtension: ModuleFileExtension = config.moduleFileExtension ?? defaultModuleFileExtension;
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();
    const entities = await getEntitiesAsync({
        kontentFetcher,
        entitiesConfig: config.entities ?? environmentEntities // default to all entities export
    });

    return {
        environmentInfo,
        environmentFiles: _environmentGenerator({
            environmentInfo,
            environmentEntities: entities
        }).generateEnvironmentModels(),
        moduleFileExtension: moduleFileExtension
    };
}

async function getEntitiesAsync({
    kontentFetcher,
    entitiesConfig
}: {
    kontentFetcher: ManagementKontentFetcher;
    entitiesConfig: readonly EnvironmentEntity[];
}): Promise<EnvironmentEntities> {
    const extendedEntityTypes = getExtendedEntityTypes(entitiesConfig);

    const [languages, taxonomies, types, snippets, collections, workflows, webhooks, assetFolders, roles] = await Promise.all([
        fetchEntity(
            () => extendedEntityTypes.includes('languages'),
            () => kontentFetcher.getLanguagesAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('taxonomies'),
            () => kontentFetcher.getTaxonomiesAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('contentTypes'),
            () => kontentFetcher.getTypesAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('snippets'),
            () => kontentFetcher.getSnippetsAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('collections'),
            () => kontentFetcher.getCollectionsAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('workflows'),
            () => kontentFetcher.getWorkflowsAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('webhooks'),
            () => kontentFetcher.getWebhooksAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('assetFolders'),
            () => kontentFetcher.getAssetFoldersAsync()
        ),
        fetchEntity(
            () => extendedEntityTypes.includes('roles'),
            () => kontentFetcher.getRolesAsync()
        )
    ]);

    return {
        assetFolders,
        collections,
        languages,
        roles,
        snippets,
        taxonomies,
        contentTypes: types,
        webhooks,
        workflows
    };
}

function getExtendedEntityTypes(entityTypes: readonly EnvironmentEntity[]): readonly EnvironmentEntity[] {
    return match(entityTypes)
        .returnType<readonly EnvironmentEntity[]>()
        .when(
            (m) => m.includes('snippets') || m.includes('contentTypes'),
            // when requesting snippets or content types, we need to fetch taxonomies & (snippets or types) as well
            // this is is because we need these entities to narrow down types for elements
            (m) => {
                const newEntities: readonly EnvironmentEntity[] = [...m, 'taxonomies', 'snippets', 'contentTypes'];

                return newEntities.filter(uniqueFilter);
            }
        )
        .otherwise((m) => m);
}

function fetchEntity<T>(canFetch: () => boolean, fetch: () => Promise<readonly T[]>): Promise<readonly T[] | undefined> {
    if (!canFetch()) {
        return Promise.resolve(undefined);
    }
    return fetch();
}
