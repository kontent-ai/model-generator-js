import { generateDeliveryModelsAsync } from "../../../lib/public_api.js";
import { integrationEnv, type SnapshotModelsTest } from "../integration-tests.config.js";

export const deliverySdkSnapshots: readonly SnapshotModelsTest[] = [
	{
		cliAction: "delivery-sdk",
		folder: "basic-js",
		getFilesAsync: async () =>
			await generateDeliveryModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
			}),
	},
	{
		cliAction: "delivery-sdk",
		folder: "name-and-file-resolvers",
		getFilesAsync: async () =>
			await generateDeliveryModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
				nameResolvers: {
					contentType: (item) => `ContentType_${item.codename}`,
					snippet: (item) => `Snippet_${item.codename}`,
					taxonomy: (item) => `Taxonomy_${item.codename}`,
				},
				fileResolvers: {
					contentType: (item) => `content_type_${item.codename}`,
					snippet: (item) => `snippet_${item.codename}`,
					taxonomy: (item) => `taxonomy_${item.codename}`,
				},
			}),
	},
	{
		cliAction: "delivery-sdk",
		folder: "custom-format-options",
		getFilesAsync: async () =>
			await generateDeliveryModelsAsync({
				addTimestamp: false,
				createFiles: false,
				environmentId: integrationEnv.id,
				managementApiKey: integrationEnv.apiKey,
				moduleFileExtension: "js",
				formatOptions: {
					printWidth: 300,
					bracketSameLine: true,
					tabWidth: 8,
				},
			}),
	},
];
