import { deleteFolderRecursive, loadMonorepoEnvFile, runScriptAsync } from "@kontent-ai/model-generator-shared/dev";
import { generateItemsAsync } from "../src/index.js";

loadMonorepoEnvFile();

const outputDir: string = "./sample/items";

await runScriptAsync(async (config) => {
	deleteFolderRecursive(outputDir);

	await generateItemsAsync({
		// required
		environmentId: config.sampleEnv.environmentId,
		addTimestamp: false,
		managementApiKey: config.sampleEnv.managementApiKey,
		moduleFileExtension: config.moduleFileExtension,
		apiMode: "default",
		deliveryApiKey: config.sampleEnv.deliveryApiKey,
		filterByTypeCodenames: [],
		generateObjects: true,
		generateTypes: true,
		createFiles: true,
		outputDir: outputDir,
		// optional
		disableComments: false,
		managementBaseUrl: undefined,
		deliveryBaseUrl: undefined,
	});
});
