import { type CliArgumentsFetcher, commandOptions, parseModuleFileExtension } from "@kontent-ai/model-generator-shared";
import { generateDeliveryModelsAsync } from "../generators/delivery/delivery-func.js";

export async function deliveryActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
	await generateDeliveryModelsAsync({
		createFiles: true,
		// required
		environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
		managementApiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
		// optional
		disableComments: cliFetcher.getBooleanArgumentValue(commandOptions.disableComments.name, false),
		managementBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
		outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
		addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
		moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name)),
	});
}
