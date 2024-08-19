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
import { GeneratorManagementClient } from '../core/index.js';
import chalk from 'chalk';
import { commonHelper } from '../common-helper.js';

interface KontentFetcherConfig {
    environmentId: string;
    apiKey: string;
    baseUrl?: string;
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
            console.log(`Project '${chalk.yellow(projectInformation.project.name)}'`);
            console.log(`Environment '${chalk.yellow(projectInformation.project.environment)}'\n`);
            return projectInformation.project;
        },
        async getWorkflowsAsync(): Promise<readonly WorkflowModels.Workflow[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listWorkflows().toPromise()).data,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' workflows`);
            return items;
        },
        async getRolesAsync(): Promise<readonly RoleModels.Role[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listRoles().toPromise()).data.roles,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' roles`);
            return items;
        },
        async getAssetFoldersAsync(): Promise<readonly AssetFolderModels.AssetFolder[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listAssetFolders().toPromise()).data.items,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' asset folders`);
            return items;
        },
        async getCollectionsAsync(): Promise<readonly CollectionModels.Collection[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listCollections().toPromise()).data.collections,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' collections`);
            return items;
        },
        async getWebhooksAsync(): Promise<readonly WebhookModels.Webhook[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listWebhooks().toPromise()).data.webhooks,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' webhooks`);
            return items;
        },
        async getLanguagesAsync(): Promise<readonly LanguageModels.LanguageModel[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listLanguages().toAllPromise()).data.items,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' languages`);
            return items;
        },
        async getTypesAsync(): Promise<readonly ContentTypeModels.ContentType[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listContentTypes().toAllPromise()).data.items,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' types`);
            return items;
        },
        async getSnippetsAsync(): Promise<readonly ContentTypeSnippetModels.ContentTypeSnippet[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listContentTypeSnippets().toAllPromise()).data.items,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' snippets`);
            return items;
        },
        async getTaxonomiesAsync(): Promise<readonly TaxonomyModels.Taxonomy[]> {
            const items = commonHelper.sortAlphabetically(
                (await client.listTaxonomies().toAllPromise()).data.items,
                (item) => item.name
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' taxonomies`);
            return items;
        }
    };
}
