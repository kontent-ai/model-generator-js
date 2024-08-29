import {
    AssetFolderModels,
    CollectionModels,
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
import { GeneratorManagementClient, sortAlphabetically, toSafeString } from '../core/index.js';
import chalk from 'chalk';

interface KontentFetcherConfig {
    readonly environmentId: string;
    readonly apiKey: string;
    readonly baseUrl?: string;
}

export function kontentFetcher(config: KontentFetcherConfig) {
    const client: GeneratorManagementClient = createManagementClient({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    return {
        async getEnvironmentInfoAsync(): Promise<Readonly<EnvironmentModels.EnvironmentInformationModel>> {
            const projectInformation = (await client.environmentInformation().toPromise()).data;
            console.log(`Project '${chalk.yellow(toSafeString(projectInformation.project.name))}'`);
            console.log(`Environment '${chalk.yellow(toSafeString(projectInformation.project.environment))}'\n`);
            return projectInformation.project;
        },
        async getWorkflowsAsync(): Promise<readonly Readonly<WorkflowModels.Workflow>[]> {
            const items = sortAlphabetically((await client.listWorkflows().toPromise()).data, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' workflows`);
            return items;
        },
        async getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]> {
            const items = sortAlphabetically((await client.listRoles().toPromise()).data.roles, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' roles`);
            return items;
        },
        async getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]> {
            const items = sortAlphabetically((await client.listAssetFolders().toPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' asset folders`);
            return items;
        },
        async getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]> {
            const items = sortAlphabetically((await client.listCollections().toPromise()).data.collections, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' collections`);
            return items;
        },
        async getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]> {
            const items = sortAlphabetically((await client.listWebhooks().toPromise()).data.webhooks, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' webhooks`);
            return items;
        },
        async getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]> {
            const items = sortAlphabetically((await client.listLanguages().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' languages`);
            return items;
        },
        async getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]> {
            const items = sortAlphabetically((await client.listContentTypes().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' types`);
            return items;
        },
        async getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]> {
            const items = sortAlphabetically((await client.listContentTypeSnippets().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' snippets`);
            return items;
        },
        async getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]> {
            const items = sortAlphabetically((await client.listTaxonomies().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' taxonomies`);
            return items;
        }
    };
}
