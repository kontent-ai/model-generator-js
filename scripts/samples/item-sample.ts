import { generateItemsAsync } from "../../lib/generators/items/items-func.js";
import { deleteFolderRecursive, runScriptAsync } from "../utils/script.utils.js";

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
		managementBaseUrl: undefined,
		formatOptions: undefined,
		deliveryBaseUrl: undefined,
	});
});
