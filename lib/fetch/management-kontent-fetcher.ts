import { HttpService } from "coreSdkLegacy";
import type {
	AssetFolderModels,
	CollectionModels,
	ContentItemModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	CustomAppModels,
	EnvironmentModels,
	LanguageModels,
	PreviewModels,
	RoleModels,
	SpaceModels,
	TaxonomyModels,
	WebhookModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { createManagementClient } from "@kontent-ai/management-sdk";
import chalk from "chalk";
import { coreConfig } from "../config.js";
import { toSafeCommentText } from "../core/comment.utils.js";
import type { GeneratorManagementClient } from "../core/core.models.js";
import { extractErrorData } from "../core/error.utils.js";

export type ManagementKontentFetcher = {
	getEnvironmentInfoAsync(): Promise<Readonly<EnvironmentModels.EnvironmentInformationModel>>;
	getItemsAsync(): Promise<readonly Readonly<ContentItemModels.ContentItem>[]>;
	getWorkflowsAsync(): Promise<readonly Readonly<WorkflowModels.Workflow>[]>;
	getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]>;
	getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]>;
	getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]>;
	getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]>;
	getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]>;
	getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]>;
	getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]>;
	getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]>;
	getCustomApps(): Promise<readonly Readonly<CustomAppModels.CustomApp>[]>;
	getSpaces(): Promise<readonly Readonly<SpaceModels.Space>[]>;
	getPreviewUrlConfiguration(): Promise<Readonly<PreviewModels.PreviewConfiguration>>;
};

export function getManagementKontentFetcher(config: {
	readonly environmentId: string;
	readonly managementApiKey: string;
	readonly baseUrl?: string;
}): ManagementKontentFetcher {
	const client: GeneratorManagementClient = createManagementClient({
		environmentId: config.environmentId,
		apiKey: config.managementApiKey,
		baseUrl: config.baseUrl,
		httpService: new HttpService({ logErrorsToConsole: false }),
		headers: [{ header: coreConfig.kontentTrackingHeaderName, value: coreConfig.kontentTrackingHeaderValue }],
	});

	return {
		async getEnvironmentInfoAsync(): Promise<Readonly<EnvironmentModels.EnvironmentInformationModel>> {
			const projectInformation = (await client.environmentInformation().toPromise()).data;
			console.log(`Project '${chalk.cyan(toSafeCommentText(projectInformation.project.name))}'`);
			console.log(`Environment '${chalk.cyan(toSafeCommentText(projectInformation.project.environment))}'\n`);
			return projectInformation.project;
		},
		async getItemsAsync(): Promise<readonly Readonly<ContentItemModels.ContentItem>[]> {
			return await fetchItemsAsync({
				fetch: async () =>
					(
						await client
							.listContentItems()
							.withListQueryConfig({
								responseFetched: (response) => {
									console.log(`Fetched '${chalk.yellow(response.data.items.length.toString())}' content items`);
								},
							})
							.toAllPromise()
					).data.items,
				itemType: "total content items",
			});
		},
		async getWorkflowsAsync(): Promise<readonly Readonly<WorkflowModels.Workflow>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listWorkflows().toPromise()).data,
				itemType: "workflows",
			});
		},
		async getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listRoles().toPromise()).data.roles,
				itemType: "roles",
				// roles are available only for enterprise subscriptions
				returnEmptyArrayOnMapiError: true,
			});
		},
		async getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listAssetFolders().toPromise()).data.items,
				itemType: "asset folders",
			});
		},
		async getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listCollections().toPromise()).data.collections,
				itemType: "collections",
			});
		},
		async getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listWebhooks().toPromise()).data.webhooks,
				itemType: "webhooks",
			});
		},
		async getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listLanguages().toAllPromise()).data.items,
				itemType: "languages",
			});
		},
		async getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listContentTypes().toAllPromise()).data.items,
				itemType: "types",
			});
		},
		async getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listContentTypeSnippets().toAllPromise()).data.items,
				itemType: "snippets",
			});
		},
		async getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listTaxonomies().toAllPromise()).data.items,
				itemType: "taxonomies",
			});
		},
		async getCustomApps(): Promise<readonly Readonly<CustomAppModels.CustomApp>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listCustomApps().toPromise()).data.items,
				itemType: "custom apps",
			});
		},
		async getSpaces(): Promise<readonly Readonly<SpaceModels.Space>[]> {
			return await fetchItemsAsync({
				fetch: async () => (await client.listSpaces().toPromise()).data,
				itemType: "spaces",
			});
		},
		async getPreviewUrlConfiguration(): Promise<Readonly<PreviewModels.PreviewConfiguration>> {
			return (await client.getPreviewConfiguration().toPromise()).data;
		},
	};
}

async function fetchItemsAsync<T>({
	fetch,
	itemType,
	returnEmptyArrayOnMapiError,
}: {
	readonly fetch: () => Promise<T[]>;
	readonly returnEmptyArrayOnMapiError?: boolean;
	readonly itemType:
		| "taxonomies"
		| "types"
		| "snippets"
		| "languages"
		| "spaces"
		| "webhooks"
		| "collections"
		| "custom apps"
		| "roles"
		| "asset folders"
		| "workflows"
		| "total content items";
}): Promise<T[]> {
	try {
		const data = await fetch();
		console.log(`Fetched '${chalk.yellow(data.length.toString())}' ${itemType}`);
		return data;
	} catch (error) {
		if (!returnEmptyArrayOnMapiError) {
			throw error;
		}

		const errorData = extractErrorData(error);

		if (errorData.isMapiError) {
			console.warn(`${chalk.red(`Skip fetching ${itemType}`)}: ${errorData.message}`);
			return [];
		}

		throw error;
	}
}
