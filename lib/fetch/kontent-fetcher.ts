import { HttpService } from '@kontent-ai/core-sdk';
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
import chalk from 'chalk';
import { GeneratorManagementClient, sortAlphabetically, toSafeString } from '../core/index.js';

interface KontentFetcherConfig {
    readonly environmentId: string;
    readonly apiKey: string;
    readonly baseUrl?: string;
}

export function kontentFetcher(config: KontentFetcherConfig) {
    const getManagementClient = (): GeneratorManagementClient => {
        return createManagementClient({
            environmentId: config.environmentId,
            apiKey: config.apiKey,
            baseUrl: config.baseUrl,
            httpService: new HttpService({ logErrorsToConsole: false })
        });
    };

    const client = getManagementClient();

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
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getRolesAsync(): Promise<readonly Readonly<RoleModels.Role>[]> {
            const items = sortAlphabetically((await client.listRoles().toPromise()).data.roles, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' roles`);
            return sortAlphabetically(items, (item) => item.codename ?? item.name);
        },
        async getAssetFoldersAsync(): Promise<readonly Readonly<AssetFolderModels.AssetFolder>[]> {
            const items = sortAlphabetically((await client.listAssetFolders().toPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' asset folders`);
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getCollectionsAsync(): Promise<readonly Readonly<CollectionModels.Collection>[]> {
            const items = sortAlphabetically((await client.listCollections().toPromise()).data.collections, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' collections`);
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getWebhooksAsync(): Promise<readonly Readonly<WebhookModels.Webhook>[]> {
            const items = sortAlphabetically((await client.listWebhooks().toPromise()).data.webhooks, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' webhooks`);
            return sortAlphabetically(items, (item) => item.name);
        },
        async getLanguagesAsync(): Promise<readonly Readonly<LanguageModels.LanguageModel>[]> {
            const items = sortAlphabetically((await client.listLanguages().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' languages`);
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getTypesAsync(): Promise<readonly Readonly<ContentTypeModels.ContentType>[]> {
            const items = sortAlphabetically((await client.listContentTypes().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' types`);
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getSnippetsAsync(): Promise<readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]> {
            const items = sortAlphabetically((await client.listContentTypeSnippets().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' snippets`);
            return sortAlphabetically(items, (item) => item.codename);
        },
        async getTaxonomiesAsync(): Promise<readonly Readonly<TaxonomyModels.Taxonomy>[]> {
            const items = sortAlphabetically((await client.listTaxonomies().toAllPromise()).data.items, (item) => item.name);
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' taxonomies`);
            return sortAlphabetically(items, (item) => item.codename);
        }
    };
}
