import { generateItemsAsync } from '../../../lib/public_api.js';
import { integrationEnv, type SnapshotModelsTest } from '../integration-tests.config.js';

export const itemsSnapshots: readonly SnapshotModelsTest[] = [
    {
        cliAction: 'items',
        folder: 'generateObjectsAndTypes-js',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js',
                apiMode: 'default',
                filterByTypeCodenames: [],
                generateObjects: true,
                generateTypes: true
            })
    },
    {
        cliAction: 'items',
        folder: 'generateObjectsAndTypes-ts',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'ts',
                apiMode: 'default',
                filterByTypeCodenames: [],
                generateObjects: true,
                generateTypes: true
            })
    },
    {
        cliAction: 'items',
        folder: 'generateObjectsOnly',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js',
                apiMode: 'default',
                filterByTypeCodenames: [],
                generateObjects: true,
                generateTypes: false
            })
    },
    {
        cliAction: 'items',
        folder: 'generateTypessOnly',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js',
                apiMode: 'default',
                filterByTypeCodenames: [],
                generateObjects: false,
                generateTypes: true
            })
    },
    {
        cliAction: 'items',
        folder: 'filterByType',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js',
                apiMode: 'default',
                filterByTypeCodenames: ['content_type_with_all_elements'],
                generateObjects: true,
                generateTypes: true
            })
    }
];
