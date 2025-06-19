import { isEnvironmentEntity } from "../../core/type-guards.js";
import { generateEnvironmentModelsAsync } from "../../generators/environment/environment-func.js";
import { parseModuleFileExtension } from "../arg.utils.js";
import type { CliArgumentsFetcher } from "../cli.models.js";
import { commandOptions } from "../command.options.js";

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
	await generateEnvironmentModelsAsync({
		// required
		createFiles: true,
		environmentId: cliFetcher.getRequiredArgumentValue(commandOptions.environmentId.name),
		managementApiKey: cliFetcher.getRequiredArgumentValue(commandOptions.managementApiKey.name),
		// optional
		entities: cliFetcher.getOptionalArgumentArrayValue(commandOptions.entities.name).filter(isEnvironmentEntity),
		managementBaseUrl: cliFetcher.getOptionalArgumentValue(commandOptions.managementBaseUrl.name),
		outputDir: cliFetcher.getOptionalArgumentValue(commandOptions.outputDir.name),
		addTimestamp: cliFetcher.getBooleanArgumentValue(commandOptions.addTimestamp.name, false),
		moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue(commandOptions.moduleFileExtension.name)),
	});
}
