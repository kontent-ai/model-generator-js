import {
	type CliArgumentsFetcher,
	commandOptions,
	isEnvironmentEntity,
	parseModuleFileExtension,
} from "@kontent-ai/model-generator-shared";
import { generateEnvironmentModelsAsync } from "../generators/environment/environment-func.js";

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
	await generateEnvironmentModelsAsync({
		// required
		createFiles: true,
		environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
		managementApiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
		// optional
		disableComments: cliFetcher.getBooleanArgumentValue(commandOptions.disableComments.name, false),
		entities: cliFetcher.getOptionalArgumentArrayValue(commandOptions.entities.name).filter(isEnvironmentEntity),
		managementBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
		outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
		addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
		moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name)),
	});
}
