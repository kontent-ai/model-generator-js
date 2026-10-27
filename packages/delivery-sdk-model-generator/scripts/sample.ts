import { deleteFolderRecursive, loadMonorepoEnvFile, runScriptAsync } from "@kontent-ai/model-generator-shared/dev";
import { generateDeliveryModelsAsync } from "../src/index.js";

loadMonorepoEnvFile();

const outputDir: string = "./sample";

await runScriptAsync(async (config) => {
	console.log(config);

	deleteFolderRecursive(outputDir);

	await generateDeliveryModelsAsync({
		// required
		environmentId: config.sampleEnv.environmentId,
		managementApiKey: config.sampleEnv.managementApiKey,
		moduleFileExtension: config.moduleFileExtension,
		createFiles: true,
		addTimestamp: false,
		outputDir: outputDir, // only required when createFiles is true

		// optional
		disableComments: false,
		fileResolvers: {
			contentType: undefined,
			snippet: undefined,
			taxonomy: undefined,
			collection: undefined,
			language: undefined,
			workflow: undefined,
		},
		nameResolvers: {
			contentType: undefined,
			snippet: undefined,
			taxonomy: undefined,
			collection: undefined,
			language: undefined,
			workflow: undefined,
		},
		managementBaseUrl: undefined,
	});
});
