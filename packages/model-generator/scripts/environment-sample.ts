import { deleteFolderRecursive, loadMonorepoEnvFile, runScriptAsync } from "@kontent-ai/model-generator-shared/dev";
import { generateEnvironmentModelsAsync } from "../src/index.js";

loadMonorepoEnvFile();

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
		disableComments: false,
		managementBaseUrl: undefined,
	});
});
