import { generateMigrationModelsAsync } from "../../../lib/public_api.js";
import { type SnapshotModelsTest, integrationEnv } from "../integration-tests.config.js";

export const migrationToolkitSnapshots: readonly SnapshotModelsTest[] = [
	{
		cliAction: "migration-toolkit",
		folder: "basic-js",
		getFilesAsync: async () =>
			await generateMigrationModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
			}),
	},
];
