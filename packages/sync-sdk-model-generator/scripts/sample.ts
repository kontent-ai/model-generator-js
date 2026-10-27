import { deleteFolderRecursive, loadMonorepoEnvFile, runScriptAsync } from "@kontent-ai/model-generator-shared/dev";
import { generateSyncModelsAsync } from "../src/index.js";

loadMonorepoEnvFile();

const outputDir: string = "./sample";

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
		disableComments: false,
		managementBaseUrl: undefined,
	});
});
