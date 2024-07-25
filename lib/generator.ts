import chalk from 'chalk';
import { GenerateMigrationModelsConfig, IGenerateDeliveryModelsConfig, ModuleResolution } from './models.js';
import { deliveryContentTypeGenerator } from './generators/delivery/delivery-content-type.generator.js';
import { projectGenerator } from './generators/index.js';
import {
    AssetFolderModels,
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    createManagementClient,
    EnvironmentModels,
    LanguageModels,
    ManagementClient,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { deliveryTaxonomyGenerator } from './generators/delivery/delivery-taxonomy.generator.js';
import { commonHelper } from './common-helper.js';
import { parse } from 'path';
import { fileHelper, fileProcessor } from './file-helper.js';
import { migrationGenerator } from './generators/migration/migration-generator.js';

export async function generateDeliveryModelsAsync(config: IGenerateDeliveryModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;

    const contentTypesFolderName: string = `content-types/`;
    const contentTypeSnippetsFolderName: string = `content-type-snippets/`;
    const taxonomiesFolderName: string = `taxonomies/`;
    const projectFolderName: string = `project/`;

    const contentTypesFolderPath: string = `${outputDir}${contentTypesFolderName}`;
    const contentTypeSnippetsFolderPath: string = `${outputDir}${contentTypeSnippetsFolderName}`;
    const taxonomiesFolderPath: string = `${outputDir}${taxonomiesFolderName}`;
    const projectFolderPath: string = `${outputDir}${projectFolderName}`;

    // prepare directories
    fileHelper.createDir(contentTypesFolderPath);
    fileHelper.createDir(contentTypeSnippetsFolderPath);
    fileHelper.createDir(taxonomiesFolderPath);
    fileHelper.createDir(projectFolderPath);

    const client = createManagementClient({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.managementApiUrl
    });

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    const projectInformation = await getEnvironmentInfoAsync(client);

    const types = await getTypesAsync(client);
    const snippets = await getSnippetsAsync(client);
    const taxonomies = await getTaxonomiesAsync(client);

    const workflows = await getWorkflowsAsync(client);
    const roles = config.isEnterpriseSubscription ? await getRolesAsync(client) : [];
    const assetFolders = await getAssetFoldersAsync(client);
    const collections = await getCollectionsAsync(client);
    const webhooks = await getWebhooksAsync(client);
    const languages = await getLanguagesAsync(client);

    console.log('');

    // create content type models
    const deliveryModels = deliveryContentTypeGenerator.generateModels({
        outputDir: outputDir,
        types: types,
        typeFolderName: contentTypesFolderName,
        taxonomyFolderName: taxonomiesFolderName,
        typeSnippetsFolderName: contentTypeSnippetsFolderName,
        taxonomies: taxonomies,
        snippets: snippets,
        addTimestamp: config.addTimestamp,
        addEnvironmentInfo: config.addEnvironmentInfo,
        elementResolver: config.elementResolver,
        contentTypeFileNameResolver: config.contentTypeFileResolver,
        contentTypeResolver: config.contentTypeResolver,
        taxonomyFileResolver: config.taxonomyTypeFileResolver,
        taxonomyResolver: config.taxonomyTypeResolver,
        contentTypeSnippetFileNameResolver: config.contentTypeSnippetFileResolver,
        contentTypeSnippetResolver: config.contentTypeSnippetResolver,
        moduleResolution: moduleResolution
    });

    // create taxonomy types
    const taxonomyFiles = deliveryTaxonomyGenerator.generateTaxonomyTypes({
        taxonomies: taxonomies,
        outputDir: outputDir,
        taxonomyFolderName: taxonomiesFolderName,
        addTimestamp: config.addTimestamp,
        fileResolver: config.taxonomyTypeFileResolver,
        taxonomyResolver: config.taxonomyTypeResolver
    });

    // create project structure
    const projectFiles = projectGenerator.generateProjectModel({
        outputDir: outputDir,
        environmentInfo: projectInformation,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        addEnvironmentInfo: config.addEnvironmentInfo,
        languages: languages,
        taxonomies: taxonomies,
        types: types,
        workflows: workflows,
        assetFolders: assetFolders,
        collections: collections,
        roles: roles,
        snippets: snippets,
        webhooks: webhooks,
        projectFolderName: projectFolderName,
        sortConfig: config.sortConfig ?? {
            sortTaxonomyTerms: true
        }
    });

    // create barrel export
    const barrelExportFilename: string = 'index.ts';

    // content types
    for (const file of deliveryModels.contentTypeFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const contentTypeBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...deliveryModels.contentTypeFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const contentTypeBarrelExportPath: string = `${contentTypesFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(contentTypeBarrelCode, contentTypeBarrelExportPath, config.formatOptions);

    // content type snippets
    for (const file of deliveryModels.snippetFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const contentTypeSnippetsBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...deliveryModels.snippetFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const contentTypeSnippetsBarrelExportPath: string = `${contentTypeSnippetsFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(
        contentTypeSnippetsBarrelCode,
        contentTypeSnippetsBarrelExportPath,
        config.formatOptions
    );

    // taxonomies
    for (const file of taxonomyFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const taxonomiesBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...taxonomyFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const taxonomiesBarrelExportPath: string = `${taxonomiesFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(taxonomiesBarrelCode, taxonomiesBarrelExportPath, config.formatOptions);

    // project barrel
    for (const file of projectFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const projectBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...projectFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const projectBarrelExportPath: string = `${projectFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(projectBarrelCode, projectBarrelExportPath, config.formatOptions);

    // main barrel
    const mainBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            `./${projectFolderName}index`,
            `./${contentTypesFolderName}index`,
            `./${contentTypeSnippetsFolderName}index`,
            `./${taxonomiesFolderName}index`
        ]
    });
    const mainBarrelExportPath: string = `${outputDir}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(mainBarrelCode, mainBarrelExportPath, config.formatOptions);

    console.log(chalk.green(`\nCompleted`));
}

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<void> {
    const client = createManagementClient({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.managementApiUrl
    });

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;
    const migrationFileProcessor = fileProcessor(outputDir);
    const barrelExportFilename: string = 'index.ts';
    const migrationItemsFolderName: string = `items`;
    const migrationTypesFilename: string = `migration-types.ts`;

    const projectInformation = await getEnvironmentInfoAsync(client);
    console.log(`Project '${chalk.yellow(projectInformation.name)}'`);
    console.log(`Environment '${chalk.yellow(projectInformation.environment)}'\n`);

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    console.log(`Module resolution '${chalk.yellow(moduleResolution)}'\n`);
    const migrationGeneratorObj = migrationGenerator({
        addTimestamp: config.addTimestamp,
        moduleResolution: config.moduleResolution,
        addEnvironmentInfo: config.addEnvironmentInfo,
        environmentData: {
            languages: await getLanguagesAsync(client),
            workflows: await getWorkflowsAsync(client),
            types: await getTypesAsync(client),
            snippets: await getSnippetsAsync(client),
            collections: await getCollectionsAsync(client)
        }
    });

    const migrationTypeFile = migrationGeneratorObj.getMigrationTypesFile(migrationTypesFilename);
    const migrationItemFiles = migrationGeneratorObj.getMigrationItemFiles(
        migrationTypesFilename,
        migrationItemsFolderName
    );
    const allFiles = [migrationTypeFile, ...migrationItemFiles];

    // create all files on FS
    for (const file of allFiles) {
        await migrationFileProcessor.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }

    // migration items barrel
    await migrationFileProcessor.createFileOnFsAsync(
        commonHelper.getBarrelExportCode({
            moduleResolution: moduleResolution,
            filenames: [
                ...migrationItemFiles.map((m) => {
                    return `./${parse(m.filename).name}`;
                })
            ]
        }),
        `${migrationItemsFolderName}/${barrelExportFilename}`,
        config.formatOptions
    );

    // main barrel
    await migrationFileProcessor.createFileOnFsAsync(
        commonHelper.getBarrelExportCode({
            moduleResolution: moduleResolution,
            filenames: [`./${migrationItemsFolderName}/index`, `./${migrationTypeFile.filename}`]
        }),
        `${barrelExportFilename}`,
        config.formatOptions
    );

    console.log(chalk.green(`\nCompleted`));
}

async function getEnvironmentInfoAsync(
    client: ManagementClient
): Promise<EnvironmentModels.EnvironmentInformationModel> {
    const projectInformation = (await client.environmentInformation().toPromise()).data;
    console.log(`Project '${chalk.yellow(projectInformation.project.name)}'`);
    console.log(`Environment '${chalk.yellow(projectInformation.project.environment)}'\n`);
    return projectInformation.project;
}

async function getWorkflowsAsync(client: ManagementClient): Promise<WorkflowModels.Workflow[]> {
    const items = commonHelper.sortAlphabetically((await client.listWorkflows().toPromise()).data, (item) => item.name);
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' workflows`);
    return items;
}

async function getRolesAsync(client: ManagementClient): Promise<RoleModels.Role[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listRoles().toPromise()).data.roles,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' roles`);
    return items;
}

async function getAssetFoldersAsync(client: ManagementClient): Promise<AssetFolderModels.AssetFolder[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listAssetFolders().toPromise()).data.items,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' asset folders`);
    return items;
}

async function getCollectionsAsync(client: ManagementClient): Promise<CollectionModels.Collection[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listCollections().toPromise()).data.collections,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' collections`);
    return items;
}

async function getWebhooksAsync(client: ManagementClient): Promise<WebhookModels.Webhook[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listWebhooks().toPromise()).data.webhooks,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' webhooks`);
    return items;
}

async function getLanguagesAsync(client: ManagementClient): Promise<LanguageModels.LanguageModel[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listLanguages().toAllPromise()).data.items,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' languages`);
    return items;
}

async function getTypesAsync(client: ManagementClient): Promise<ContentTypeModels.ContentType[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listContentTypes().toAllPromise()).data.items,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' types`);
    return items;
}

async function getSnippetsAsync(client: ManagementClient): Promise<ContentTypeSnippetModels.ContentTypeSnippet[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listContentTypeSnippets().toAllPromise()).data.items,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' snippets`);
    return items;
}

async function getTaxonomiesAsync(client: ManagementClient): Promise<TaxonomyModels.Taxonomy[]> {
    const items = commonHelper.sortAlphabetically(
        (await client.listTaxonomies().toAllPromise()).data.items,
        (item) => item.name
    );
    console.log(`Fetched '${chalk.yellow(items.length.toString())}' taxonomies`);
    return items;
}
