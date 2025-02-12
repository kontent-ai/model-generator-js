import { describe, expect, it } from 'vitest';
import type { CliAction, GeneratedFile } from '../../lib/core/core.models.js';
import { formatCodeAsync } from '../../lib/format/formatter.js';
import {
    generateDeliveryModelsAsync,
    generateEnvironmentModelsAsync,
    generateItemsAsync,
    generateMigrationModelsAsync
} from '../../lib/public_api.js';
import { getEnvironmentRequiredValue } from '../../scripts/utils/environment.utils.js';

type SnapshotModelsTest = {
    readonly cliAction: CliAction;
    readonly getFilesAsync: () => Promise<readonly GeneratedFile[]>;
};

const snapshotTests: readonly SnapshotModelsTest[] = [
    {
        cliAction: 'delivery-sdk',
        getFilesAsync: async () =>
            await generateDeliveryModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: getEnvironmentRequiredValue('ENVIRONMENT_ID'),
                apiKey: getEnvironmentRequiredValue('MANAGEMENT_API_KEY'),
                moduleFileExtension: 'js'
            })
    },
    {
        cliAction: 'environment',
        getFilesAsync: async () =>
            await generateEnvironmentModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: getEnvironmentRequiredValue('ENVIRONMENT_ID'),
                apiKey: getEnvironmentRequiredValue('MANAGEMENT_API_KEY'),
                moduleFileExtension: 'js',
                isEnterpriseSubscription: false
            })
    },
    {
        cliAction: 'items',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: getEnvironmentRequiredValue('ENVIRONMENT_ID'),
                apiKey: getEnvironmentRequiredValue('MANAGEMENT_API_KEY'),
                moduleFileExtension: 'js',
                apiMode: 'default',
                filterByTypeCodenames: [],
                generateObjects: true,
                generateTypes: true
            })
    },
    {
        cliAction: 'migration-toolkit',
        getFilesAsync: async () =>
            await generateMigrationModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: getEnvironmentRequiredValue('ENVIRONMENT_ID'),
                apiKey: getEnvironmentRequiredValue('MANAGEMENT_API_KEY'),
                moduleFileExtension: 'js'
            })
    }
];

for (const snapshot of snapshotTests) {
    describe(`Models - ${snapshot.cliAction}`, async () => {
        const files = await snapshot.getFilesAsync();

        it(`Number of generated files & names should match`, async () => {
            const filename = `./snapshots/${snapshot.cliAction}/_filesList.json`;

            await expect(
                await formatCodeAsync(JSON.stringify(files.map<{ filename: string }>((file) => ({ filename: file.filename }))), {
                    parser: 'json'
                })
            ).toMatchFileSnapshot(filename, `Invalid file '${filename}'`);
        });

        it(`Code of generated models should match snapshots`, async () => {
            for (const file of files) {
                const filename = `./snapshots/${snapshot.cliAction}/${file.filename}`;
                await expect(file.text).toMatchFileSnapshot(filename, `Invalid file '${filename}'`);
            }
        });
    });
}
