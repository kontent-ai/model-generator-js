import { ModuleResolution } from '../../core/core.models.js';
import { generateMigrationModelsAsync } from '../../generators/migration/migration-func.js';
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
