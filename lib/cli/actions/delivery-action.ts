import { generateDeliveryModelsAsync } from '../../generators/delivery/delivery-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
import type { CliArgumentsFetcher } from '../cli.models.js';
import { commandOptions } from '../command.options.js';

export async function deliveryActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateDeliveryModelsAsync({
        createFiles: true,
        // required
        environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
        managementApiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
        // optional
        managementBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
        outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
        addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name))
    });
}
