import { generateMigrationModelsAsync } from '../../../lib/public_api.js';
import { integrationEnv, type SnapshotModelsTest } from '../integration-tests.config.js';

export const migrationToolkitSnapshots: readonly SnapshotModelsTest[] = [
    {
        cliAction: 'migration-toolkit',
        folder: 'basic-js',
        getFilesAsync: async () =>
            await generateMigrationModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js'
            })
    },
    {
        cliAction: 'migration-toolkit',
        folder: 'basic-ts',
        getFilesAsync: async () =>
            await generateMigrationModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                managementApiKey: integrationEnv.apiKey,
                moduleFileExtension: 'ts'
            })
    }
];
