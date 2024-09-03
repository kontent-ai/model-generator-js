import { ModuleResolution } from '../../../core/index.js';
import { generateMigrationModelsAsync } from '../../../generators/index.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function migrateActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateMigrationModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue('baseUrl'),
        outputDir: cliFetcher.getOptionalArgumentValue('outputDir'),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution: cliFetcher.getOptionalArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
