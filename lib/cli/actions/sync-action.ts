import { generateSyncModelsAsync } from "../../generators/sync/sync-func.js";
import { parseModuleFileExtension } from "../arg.utils.js";
import type { CliArgumentsFetcher } from "../cli.models.js";
import { commandOptions } from "../command.options.js";

export async function syncActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
	await generateSyncModelsAsync({
		// required
		createFiles: true,
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
