import { generateSyncModelsAsync } from "../../lib/generators/sync/sync-func.js";
import { deleteFolderRecursive, runScriptAsync } from "../utils/script.utils.js";

const outputDir: string = "./sample/sync";

await runScriptAsync(async (config) => {
	deleteFolderRecursive(outputDir);

	await generateSyncModelsAsync({
		// required
		createFiles: true,
		addTimestamp: false,
		environmentId: config.sampleEnv.environmentId,
		managementApiKey: config.sampleEnv.managementApiKey,
		moduleFileExtension: config.moduleFileExtension,
		outputDir: outputDir, // only required when createFiles is true

		// optional
		managementBaseUrl: undefined,
		formatOptions: undefined,
	});
});
