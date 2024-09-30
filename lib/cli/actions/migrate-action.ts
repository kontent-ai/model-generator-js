import { generateMigrationModelsAsync } from '../../generators/migration/migration-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
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
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue('moduleFileExtension'))
    });
}
