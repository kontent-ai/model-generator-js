import { generateItemsAsync } from '../../generators/items/items-func.js';
import { parseDeliveryApiMode, parseModuleFileExtension } from '../arg.utils.js';
import type { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function itemsActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateItemsAsync({
        // required
        createFiles: true,
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentIdOption.name),
        apiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKeyOption.name),
        // optional
        generateTypes: cliFetcher.getBooleanArgumentValue(commandOptions.generateTypesOption.name, false),
        generateObjects: cliFetcher.getBooleanArgumentValue(commandOptions.generateObjectsOption.name, false),
        deliveryApiKey: cliFetcher.getOptionalArgumentValue(commandOptions.deliveryApiKeyOption.name),
        baseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrlOption.name),
        deliveryBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.deliveryBaseUrlOption.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDirOption.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestampOption.name, false),
        apiMode: parseDeliveryApiMode(cliFetcher.getOptionalArgumentValue(commandOptions.apiModeOption.name)),
        filterByTypeCodenames: cliFetcher.getOptionalArgumentArrayVaue(commandOptions.contentTypesOption.name) ?? [],
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtensionOption.name))
    });
}
