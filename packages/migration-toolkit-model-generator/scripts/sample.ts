import { deleteFolderRecursive, loadMonorepoEnvFile, runScriptAsync } from "@kontent-ai/model-generator-shared/dev";
import { generateMigrationModelsAsync } from "../src/index.js";

loadMonorepoEnvFile();

const outputDir: string = "./sample";

await runScriptAsync(async (config) => {
	deleteFolderRecursive(outputDir);

	await generateMigrationModelsAsync({
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
