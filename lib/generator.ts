import chalk from 'chalk';
import { IGenerateModelsConfig, ModuleResolution } from './models.js';
import { deliveryContentTypeGenerator } from './generators/delivery/delivery-content-type.generator.js';
import { projectGenerator } from './generators/index.js';
import {
    AssetFolderModels,
    CollectionModels,
    createManagementClient,
    LanguageModels,
    RoleModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { deliveryTaxonomyGenerator } from './generators/delivery/delivery-taxonomy.generator.js';
import { commonHelper } from './common-helper.js';
import { parse } from 'path';
import { fileHelper } from './file-helper.js';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));

    try {
        if (config.sdkType === 'delivery') {
            await generateDeliveryModelsAsync(config);
        } else if (config.sdkType === 'migration') {
            await generateMigrationModelsAsync();
        } else {
            throw Error(`Unsupported 'sdkType'. Supported values are: 'delivery', 'migration'`);
        }
        console.log(chalk.green(`\nCompleted`));
    } catch (error) {
        console.log(chalk.red(`Failed with error:`));
        throw error;
    }
}

async function generateDeliveryModelsAsync(config: IGenerateModelsConfig): Promise<void> {
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

    const managementClient = createManagementClient({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.managementApiUrl
    });

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';

    const projectInformation = (await managementClient.environmentInformation().toPromise()).data;
    console.log(`Project '${chalk.yellow(projectInformation.project.name)}'`);
    console.log(`Environment '${chalk.yellow(projectInformation.project.environment)}'\n`);
    console.log(`Module resolution '${chalk.yellow(moduleResolution)}'\n`);

    const types = commonHelper.sortAlphabetically(
        (await managementClient.listContentTypes().toAllPromise()).data.items,
        (item) => item.name
    );
    const snippets = commonHelper.sortAlphabetically(
        (await managementClient.listContentTypeSnippets().toAllPromise()).data.items,
        (item) => item.name
    );
    const taxonomies = commonHelper.sortAlphabetically(
        (await managementClient.listTaxonomies().toAllPromise()).data.items,
        (item) => item.name
    );

    console.log(`Found '${chalk.yellow(types.length.toString())}' types`);
    console.log(`Found '${chalk.yellow(snippets.length.toString())}' content type snippets`);
    console.log(`Found '${chalk.yellow(taxonomies.length.toString())}' taxonomies`);

    const workflows: WorkflowModels.Workflow[] = [];
    const roles: RoleModels.Role[] = [];
    const assetFolders: AssetFolderModels.AssetFolder[] = [];
    const collections: CollectionModels.Collection[] = [];
    const webhooks: WebhookModels.Webhook[] = [];
    const languages: LanguageModels.LanguageModel[] = [];

    const exportAllProjectSettings = config.exportProjectSettings ? false : true;

    if (config.exportProjectSettings?.exportWorkflows || exportAllProjectSettings) {
        workflows.push(
            ...commonHelper.sortAlphabetically(
                (await managementClient.listWorkflows().toPromise()).data,
                (item) => item.name
            )
        );
        console.log(`Found '${chalk.yellow(workflows.length.toString())}' workflows`);
    } else {
        console.log(`Skipping '${chalk.red('workflows')}' export`);
    }

    if (config.isEnterpriseSubscription) {
        if (config.exportProjectSettings?.exportRoles || exportAllProjectSettings) {
            roles.push(
                ...commonHelper.sortAlphabetically(
                    (await managementClient.listRoles().toPromise()).data.roles,
                    (item) => item.name
                )
            );
            console.log(`Found '${chalk.yellow(roles.length.toString())}' roles`);
        } else {
            console.log(`Skipping '${chalk.red('roles')}' export`);
        }
    } else {
        console.log(`Skipping '${chalk.red('roles')}' export because enterprise subscription is disabled`);
    }

    if (config.exportProjectSettings?.exportAssetFolders || exportAllProjectSettings) {
        assetFolders.push(
            ...commonHelper.sortAlphabetically(
                (await managementClient.listAssetFolders().toPromise()).data.items,
                (item) => item.name
            )
        );
        console.log(
            `Found '${chalk.yellow(projectGenerator.getAssetFoldersCount(assetFolders).toString())}' asset folders`
        );
    } else {
        console.log(`Skipping '${chalk.red('asset folders')}' export`);
    }

    if (config.exportProjectSettings?.exportCollections || exportAllProjectSettings) {
        collections.push(
            ...commonHelper.sortAlphabetically(
                (await managementClient.listCollections().toPromise()).data.collections,
                (item) => item.name
            )
        );
        console.log(`Found '${chalk.yellow(collections.length.toString())}' collections`);
    } else {
        console.log(`Skipping '${chalk.red('collections')}' export`);
    }

    if (config.exportProjectSettings?.exportWebhooks || exportAllProjectSettings) {
        webhooks.push(
            ...commonHelper.sortAlphabetically(
                (await managementClient.listWebhooks().toPromise()).data.webhooks,
                (item) => item.name
            )
        );
        console.log(`Found '${chalk.yellow(webhooks.length.toString())}' webhooks`);
    } else {
        console.log(`Skipping '${chalk.red('webhooks')}' export`);
    }

    if (config.exportProjectSettings?.exportLanguages || exportAllProjectSettings) {
        languages.push(
            ...commonHelper.sortAlphabetically(
                (await managementClient.listLanguages().toAllPromise()).data.items,
                (item) => item.name
            )
        );
        console.log(`Found '${chalk.yellow(languages.length.toString())}' languages`);
    } else {
        console.log(`Skipping '${chalk.red('languages')}' export`);
    }

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
        environmentInfo: projectInformation.project,
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
}

async function generateMigrationModelsAsync(): Promise<void> {}
