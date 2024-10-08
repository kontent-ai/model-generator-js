import { HttpService } from '@kontent-ai/core-sdk';
import {
    AssetFolderModels,
    CollectionModels,
    ContentItemModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    createManagementClient,
    EnvironmentModels,
    LanguageModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { coreConfig } from '../config.js';
import { toSafeComment } from '../core/comment.utils.js';
import { GeneratorManagementClient } from '../core/core.models.js';

interface KontentFetcherConfig {
    readonly environmentId: string;
    readonly apiKey: string;
    readonly baseUrl?: string;
}

export function managementKontentFetcher(config: KontentFetcherConfig) {
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
            const data = (
                await client
                    .listContentItems()
                    .withListQueryConfig({
                        responseFetched: (response) => {
                            console.log(`Fetched '${chalk.yellow(response.data.items.length.toString())}' content items`);
                        }
                    })
                    .toAllPromise()
            ).data;

            return data.items;
        },
        async getWorkflowsAsync(): Promise<readonly Readonly<WorkflowModels.Workflow>[]> {
            const items = (await client.listWorkflows().toPromise()).data;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' workflows`);
            return items;
        },
        async getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]> {
            const items = (await client.listRoles().toPromise()).data.roles;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' roles`);
            return items;
        },
        async getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]> {
            const items = (await client.listAssetFolders().toPromise()).data.items;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' asset folders`);
            return items;
        },
        async getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]> {
            const items = (await client.listCollections().toPromise()).data.collections;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' collections`);
            return items;
        },
        async getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]> {
            const items = (await client.listWebhooks().toPromise()).data.webhooks;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' webhooks`);
            return items;
        },
        async getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]> {
            const items = (await client.listLanguages().toAllPromise()).data.items;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' languages`);
            return items;
        },
        async getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]> {
            const items = (await client.listContentTypes().toAllPromise()).data.items;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' types`);
            return items;
        },
        async getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]> {
            const items = (await client.listContentTypeSnippets().toAllPromise()).data.items;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' snippets`);
            return items;
        },
        async getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]> {
            const items = (await client.listTaxonomies().toAllPromise()).data.items;
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' taxonomies`);
            return items;
        }
    };
}
