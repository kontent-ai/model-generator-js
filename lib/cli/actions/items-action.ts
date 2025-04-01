import { generateItemsAsync } from '../../generators/items/items-func.js';
import { parseDeliveryApiMode, parseModuleFileExtension } from '../arg.utils.js';
import type { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function itemsActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateItemsAsync({
        // required
        createFiles: true,
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
        managementApiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
        // optional
        generateTypes: cliFetcher.getBooleanArgumentValue(commandOptions.generateTypes.name, false),
        generateObjects: cliFetcher.getBooleanArgumentValue(commandOptions.generateObjects.name, false),
        deliveryApiKey: cliFetcher.getOptionalArgumentValue(commandOptions.deliveryApiKey.name),
        managementBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
        deliveryBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.deliveryBaseUrl.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
        apiMode: parseDeliveryApiMode(cliFetcher.getOptionalArgumentValue(commandOptions.apiMode.name)),
        filterByTypeCodenames: cliFetcher.getOptionalArgumentArrayValue(commandOptions.contentTypes.name) ?? [],
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name))
    });
}
