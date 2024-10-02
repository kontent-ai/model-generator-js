import { generateMigrationModelsAsync } from '../../generators/migration/migration-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import { CliArgumentsFetcher } from '../cli.models.js';
import {
    addTimestampOption,
    environmentIdOption,
    managementApiKeyOption,
    managementBaseUrlOption,
    moduleFileExtensionOption,
    outputDirOption
} from '../command.options.js';

export async function migrateActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateMigrationModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue(environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(managementApiKeyOption.name),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue(managementBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(addTimestampOption.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(moduleFileExtensionOption.name))
    });
}
