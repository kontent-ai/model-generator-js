import { generateEnvironmentModelsAsync } from '../../generators/environment/environment-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateEnvironmentModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKeyOption.name),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestampOption.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtensionOption.name)),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue(commandOptions.isEnterpriseSubscriptionOption.name, false)
    });
}
