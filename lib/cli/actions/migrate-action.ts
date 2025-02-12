import { generateMigrationModelsAsync } from '../../generators/migration/migration-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import type { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function migrateActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateMigrationModelsAsync({
        // required
        createFiles: true,
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKeyOption.name),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestampOption.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtensionOption.name))
    });
}
