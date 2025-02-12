import { HttpService } from '@kontent-ai/core-sdk';
import type {
    AssetFolderModels,
    CollectionModels,
    ContentItemModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import {
    createManagementClient
} from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { coreConfig } from '../config.js';
import { toSafeComment } from '../core/comment.utils.js';
import type { GeneratorManagementClient } from '../core/core.models.js';

export function managementKontentFetcher(config: { readonly environmentId: string; readonly apiKey: string; readonly baseUrl?: string }) {
    const client: GeneratorManagementClient = createManagementClient({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        httpService: new HttpService({ logErrorsToConsole: false }),
        headers: [{ header: coreConfig.kontentTrackingHeaderName, value: coreConfig.kontentTrackingHeaderValue }]
    });

    return {
        async getEnvironmentInfoAsync(): Promise<Readonly<EnvironmentModels.EnvironmentInformationModel>> {
            const projectInformation = (await client.environmentInformation().toPromise()).data;
            console.log(`Project '${chalk.cyan(toSafeComment(projectInformation.project.name))}'`);
            console.log(`Environment '${chalk.cyan(toSafeComment(projectInformation.project.environment))}'\n`);
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
                                }
                            })
                            .toAllPromise()
                    ).data.items,
                itemType: 'total content items'
            });
        },
        async getWorkflowsAsync(): Promise<readonly Readonly<WorkflowModels.Workflow>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listWorkflows().toPromise()).data,
                itemType: 'workflows'
            });
        },
        async getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listRoles().toPromise()).data.roles,
                itemType: 'roles'
            });
        },
        async getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listAssetFolders().toPromise()).data.items,
                itemType: 'asset folders'
            });
        },
        async getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listCollections().toPromise()).data.collections,
                itemType: 'collections'
            });
        },
        async getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listWebhooks().toPromise()).data.webhooks,
                itemType: 'webhooks'
            });
        },
        async getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listLanguages().toAllPromise()).data.items,
                itemType: 'languages'
            });
        },
        async getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listContentTypes().toAllPromise()).data.items,
                itemType: 'types'
            });
        },
        async getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listContentTypeSnippets().toAllPromise()).data.items,
                itemType: 'snippets'
            });
        },
        async getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]> {
            return await fetchItemsAsync({
                fetch: async () => (await client.listTaxonomies().toAllPromise()).data.items,
                itemType: 'taxonomies'
            });
        }
    };
}

async function fetchItemsAsync<T>({
    fetch,
    itemType
}: {
    readonly fetch: () => Promise<T[]>;
    readonly itemType:
        | 'taxonomies'
        | 'types'
        | 'snippets'
        | 'languages'
        | 'webhooks'
        | 'collections'
        | 'roles'
        | 'asset folders'
        | 'workflows'
        | 'total content items';
}): Promise<T[]> {
    const data = await fetch();
    console.log(`Fetched '${chalk.yellow(data.length.toString())}' ${itemType}`);
    return data;
}
