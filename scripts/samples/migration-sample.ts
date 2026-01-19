import { generateMigrationModelsAsync } from "../../lib/generators/migration/migration-func.js";
import { deleteFolderRecursive, runScriptAsync } from "../utils/script.utils.js";

const outputDir: string = "./sample/migration";

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
		managementBaseUrl: undefined,
	});
});
