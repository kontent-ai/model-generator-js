import { generateEnvironmentModelsAsync } from '../../generators/environment/environment-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import { CliArgumentsFetcher } from '../cli.models.js';
import {
    addTimestampOption,
    environmentIdOption,
    isEnterpriseSubscriptionOption,
    managementApiKeyOption,
    managementBaseUrlOption,
    moduleFileExtensionOption,
    outputDirOption
} from '../command.options.js';

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateEnvironmentModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue(environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(managementApiKeyOption.name),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue(managementBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(addTimestampOption.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(moduleFileExtensionOption.name)),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue(isEnterpriseSubscriptionOption.name, false)
    });
}
