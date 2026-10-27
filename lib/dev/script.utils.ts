import { rmSync } from "node:fs";
import { colorize } from "@kontent-ai/core-sdk/devkit";
import { parseModuleFileExtension } from "../cli/arg.utils.js";
import type { ModuleFileExtension } from "../core/core.models.js";
import { logError } from "../core/error.utils.js";
import { getEnvironmentRequiredValue } from "./environment.utils.js";

export async function runScriptAsync(
	func: (config: {
		readonly sampleEnv: {
			readonly managementApiKey: string;
			readonly deliveryApiKey: string;
			readonly environmentId: string;
		};
		readonly integrationEnv: {
			readonly managementApiKey: string;
			readonly environmentId: string;
		};

		readonly moduleFileExtension: ModuleFileExtension;
	}) => Promise<void>,
): Promise<void> {
	try {
		await func({
			sampleEnv: {
				deliveryApiKey: getEnvironmentRequiredValue("SAMPLE_DELIVERY_API_KEY"),
				environmentId: getEnvironmentRequiredValue("SAMPLE_ENVIRONMENT_ID"),
				managementApiKey: getEnvironmentRequiredValue("SAMPLE_MANAGEMENT_API_KEY"),
			},
			integrationEnv: {
				environmentId: getEnvironmentRequiredValue("INTEGRATION_ENVIRONMENT_ID"),
				managementApiKey: getEnvironmentRequiredValue("INTEGRATION_MANAGEMENT_API_KEY"),
			},
			moduleFileExtension: parseModuleFileExtension(getEnvironmentRequiredValue("MODULE_EXTENSION")),
		});
	} catch (error) {
		logError(error);
	}
}

export function deleteFolderRecursive(path: string): void {
	console.log(`Deleting existing folder '${colorize("yellow", path)}'`);
	rmSync(path, {
		recursive: true,
		force: true,
	});

	console.log(`Folder '${colorize("yellow", path)}' deleted successfully`);
}
