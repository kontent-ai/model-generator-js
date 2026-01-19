import { generateEnvironmentModelsAsync } from "../../lib/generators/environment/environment-func.js";
import { deleteFolderRecursive, runScriptAsync } from "../utils/script.utils.js";

const outputDir: string = "./sample/environment";

await runScriptAsync(async (config) => {
	deleteFolderRecursive(outputDir);

	await generateEnvironmentModelsAsync({
		// required
		environmentId: config.sampleEnv.environmentId,
		managementApiKey: config.sampleEnv.managementApiKey,
		entities: undefined, // all entity types are exported by default
		addTimestamp: false,
		moduleFileExtension: config.moduleFileExtension,
		createFiles: true,
		outputDir: outputDir, // only required when createFiles is true
		// optional
		managementBaseUrl: undefined,
	});
});
