import { generateItemsAsync } from '../../generators/items/items-func.js';
import { parseDeliveryApiMode, parseModuleFileExtension } from '../arg.utils.js';
import { CliArgumentsFetcher } from '../cli.models.js';
import {
    addTimestampOption,
    apiModeOption,
    contentTypesOption,
    deliveryApiKeyOption,
    deliveryBaseUrlOption,
    environmentIdOption,
    generateObjectsOption,
    generateTypesOption,
    managementApiKeyOption,
    managementBaseUrlOption,
    moduleFileExtensionOption,
    outputDirOption
} from '../command.options.js';

export async function itemsActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateItemsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue(environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(managementApiKeyOption.name),
        // optional
        generateTypes: cliFetcher.getBooleanArgumentValue(generateTypesOption.name, false),
        generateObjects: cliFetcher.getBooleanArgumentValue(generateObjectsOption.name, false),
        deliveryApiKey: cliFetcher.getOptionalArgumentValue(deliveryApiKeyOption.name),
        baseUrl: cliFetcher.getOptionalArgumentValue(managementBaseUrlOption.name),
        deliveryBaseUrl: cliFetcher.getOptionalArgumentValue(deliveryBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(addTimestampOption.name, false),
        apiMode: parseDeliveryApiMode(cliFetcher.getOptionalArgumentValue(apiModeOption.name)),
        filterByTypeCodenames: cliFetcher.getOptionalArgumentArrayVaue(contentTypesOption.name) ?? [],
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(moduleFileExtensionOption.name))
    });
}
