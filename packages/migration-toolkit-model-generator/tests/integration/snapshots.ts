import { integrationEnv, type SnapshotModelsTest } from "@kontent-ai/model-generator-shared/testing";
import { generateMigrationModelsAsync } from "../../src/index.js";

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
