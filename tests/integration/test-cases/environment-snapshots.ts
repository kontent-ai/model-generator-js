import { generateEnvironmentModelsAsync } from "../../../lib/public_api.js";
import { type SnapshotModelsTest, integrationEnv } from "../integration-tests.config.js";

export const environmentSnapshots: readonly SnapshotModelsTest[] = [
	{
		cliAction: "environment",
		folder: "all-entities-js",
		getFilesAsync: async () =>
			await generateEnvironmentModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
			}),
	},
	{
		cliAction: "environment",
		folder: "entities-filter-1",
		getFilesAsync: async () =>
			await generateEnvironmentModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
				entities: ["taxonomies"],
			}),
	},
	{
		cliAction: "environment",
		folder: "entities-filter-2",
		getFilesAsync: async () =>
			await generateEnvironmentModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
				entities: ["contentTypes"],
			}),
	},
	{
		cliAction: "environment",
		folder: "entities-filter-3",
		getFilesAsync: async () =>
			await generateEnvironmentModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
				entities: ["languages", "snippets", "workflows"],
			}),
	},
];
