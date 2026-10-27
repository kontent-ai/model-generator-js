import { integrationEnv, type SnapshotModelsTest } from "@kontent-ai/model-generator-shared/testing";
import { generateSyncModelsAsync } from "../../src/index.js";

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
