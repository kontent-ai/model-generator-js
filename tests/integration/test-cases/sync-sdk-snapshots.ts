import { generateSyncModelsAsync } from "../../../lib/generators/sync/sync-func.js";
import { integrationEnv, type SnapshotModelsTest } from "../integration-tests.config.js";

export const syncSdkSnapshots: readonly SnapshotModelsTest[] = [
	{
		cliAction: "sync-sdk",
		folder: "basic-js",
		getFilesAsync: async () =>
			await generateSyncModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
			}),
	},
];
