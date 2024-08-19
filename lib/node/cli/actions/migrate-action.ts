import { generateMigrationModelsAsync } from '../../../generators/index.js';
import { ModuleResolution } from '../../../models.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function migrateActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateMigrationModelsAsync({
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        baseUrl: cliFetcher.getRequiredArgumentValue('managementApiUrl'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        outputDir: cliFetcher.getRequiredArgumentValue('outputDir'),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        addEnvironmentInfo: cliFetcher.getBooleanArgumentValue('addEnvironmentInfo', false),
        formatOptions: undefined,
        moduleResolution:
            cliFetcher.getRequiredArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
