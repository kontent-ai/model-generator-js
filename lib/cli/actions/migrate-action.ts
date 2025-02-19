import { generateMigrationModelsAsync } from '../../generators/migration/migration-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import type { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function migrateActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateMigrationModelsAsync({
        // required
        createFiles: true,
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
        apiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name))
    });
}
