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

const integrationEnv = {
    id: getEnvironmentRequiredValue('INTEGRATION_ENVIRONMENT_ID'),
    apiKey: getEnvironmentRequiredValue('INTEGRATION_MANAGEMENT_API_KEY')
} as const;

const snapshotTests: readonly SnapshotModelsTest[] = [
    {
        cliAction: 'delivery-sdk',
        getFilesAsync: async () =>
            await generateDeliveryModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                apiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js'
            })
    },
    {
        cliAction: 'environment',
        getFilesAsync: async () =>
            await generateEnvironmentModelsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                apiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js'
            })
    },
    {
        cliAction: 'items',
        getFilesAsync: async () =>
            await generateItemsAsync({
                addTimestamp: false,
                createFiles: false,
                environmentId: integrationEnv.id,
                apiKey: integrationEnv.apiKey,
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
                environmentId: integrationEnv.id,
                apiKey: integrationEnv.apiKey,
                moduleFileExtension: 'js'
            })
    }
];

for (const snapshot of snapshotTests) {
    describe(`Integration - ${snapshot.cliAction}`, async () => {
        const files = await snapshot.getFilesAsync();
        const getSnapshotRelativePath = (file: GeneratedFile) => `./snapshots/${snapshot.cliAction}/${file.filename}`;

        it(`Number of generated files & names should match`, async () => {
            const filename = `./snapshots/${snapshot.cliAction}/_filesList.json`;

            await expect(
                await formatCodeAsync(JSON.stringify(files.map<{ filename: string }>((file) => ({ filename: file.filename }))), {
                    parser: 'json'
                })
            ).toMatchFileSnapshot(filename, `Invalid file '${filename}'`);
        });

        for (const file of files) {
            it(`File '${file.filename}' should match snapshot`, async () => {
                const filename = getSnapshotRelativePath(file);
                await expect(file.text).toMatchFileSnapshot(filename);
            });

            it(`File '${file.filename}' code should format TS code without throwing exception`, async () => {
                await expect(formatCodeAsync(file.text, { parser: 'typescript' })).resolves.toBeTruthy();
            });
        }
    });
}
