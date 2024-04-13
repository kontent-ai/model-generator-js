import Colors from 'colors';
import { IGenerateModelsConfig } from './models.js';
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
import { deliveryTaxonomylGenerator as deliveryTaxonomyGenerator } from './generators/delivery/delivery-taxonomy.generator.js';
import { commonHelper } from './common-helper.js';
import { parse } from 'path';
import { fileHelper } from './file-helper.js';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(Colors.green(`Model generator started \n`));

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;

    const contentTypesFolderName: string = `content-types/`;
    const contentTypeSnippetsFolderName: string = `content-type-snippets/`;
    const taxonomiesFolderName: string = `taxonomies/`;
    const projectFolderName: string = `project/`;

    const contentTypesFolderPath: string = `${outputDir}${contentTypesFolderName}`;
    const contentTypeSnippetsFolderPath: string = `${outputDir}${contentTypeSnippetsFolderName}`;
    const taxonomiesFolderPath: string = `${outputDir}${taxonomiesFolderName}`;
    const projectFolderPath: string = `${outputDir}${projectFolderName}`;

    try {
        if (config.sdkType === 'delivery') {
            console.log(`Generating '${Colors.yellow('delivery')}' models\n`);

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

            const projectInformation = (await managementClient.environmentInformation().toPromise()).data;
            console.log(`Project '${Colors.yellow(projectInformation.project.name)}'`);
            console.log(`Environment '${Colors.yellow(projectInformation.project.environment)}'\n`);

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

            console.log(`Found '${Colors.yellow(types.length.toString())}' types`);
            console.log(`Found '${Colors.yellow(snippets.length.toString())}' content type snippets`);
            console.log(`Found '${Colors.yellow(taxonomies.length.toString())}' taxonomies`);

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
                console.log(`Found '${Colors.yellow(workflows.length.toString())}' workflows`);
            } else {
                console.log(`Skipping '${Colors.red('workflows')}' export`);
            }

            if (config.isEnterpriseSubscription) {
                if (config.exportProjectSettings?.exportRoles || exportAllProjectSettings) {
                    roles.push(
                        ...commonHelper.sortAlphabetically(
                            (await managementClient.listRoles().toPromise()).data.roles,
                            (item) => item.name
                        )
                    );
                    console.log(`Found '${Colors.yellow(roles.length.toString())}' roles`);
                } else {
                    console.log(`Skipping '${Colors.red('roles')}' export`);
                }
            } else {
                console.log(`Skipping '${Colors.red('roles')}' export because enterprise subscription is disabled`);
            }

            if (config.exportProjectSettings?.exportAssetFolders || exportAllProjectSettings) {
                assetFolders.push(
                    ...commonHelper.sortAlphabetically(
                        (await managementClient.listAssetFolders().toPromise()).data.items,
                        (item) => item.name
                    )
                );
                console.log(
                    `Found '${Colors.yellow(projectGenerator.getAssetFoldersCount(assetFolders).toString())}' asset folders`
                );
            } else {
                console.log(`Skipping '${Colors.red('asset folders')}' export`);
            }

            if (config.exportProjectSettings?.exportCollections || exportAllProjectSettings) {
                collections.push(
                    ...commonHelper.sortAlphabetically(
                        (await managementClient.listCollections().toPromise()).data.collections,
                        (item) => item.name
                    )
                );
                console.log(`Found '${Colors.yellow(collections.length.toString())}' collections`);
            } else {
                console.log(`Skipping '${Colors.red('collections')}' export`);
            }

            if (config.exportProjectSettings?.exportWebhooks || exportAllProjectSettings) {
                webhooks.push(
                    ...commonHelper.sortAlphabetically(
                        (await managementClient.listWebhooks().toPromise()).data.webhooks,
                        (item) => item.name
                    )
                );
                console.log(`Found '${Colors.yellow(webhooks.length.toString())}' webhooks`);
            } else {
                console.log(`Skipping '${Colors.red('webhooks')}' export`);
            }

            if (config.exportProjectSettings?.exportLanguages || exportAllProjectSettings) {
                languages.push(
                    ...commonHelper.sortAlphabetically(
                        (await managementClient.listLanguages().toAllPromise()).data.items,
                        (item) => item.name
                    )
                );
                console.log(`Found '${Colors.yellow(languages.length.toString())}' languages`);
            } else {
                console.log(`Skipping '${Colors.red('languages')}' export`);
            }

            console.log('');

            // create content type models
            const deliveryModels = await deliveryContentTypeGenerator.generateModelsAsync({
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
                contentTypeSnippetResolver: config.contentTypeSnippetResolver
            });

            // create taxonomy types
            const taxonomyFiles = await deliveryTaxonomyGenerator.generateTaxonomyTypesAsync({
                taxonomies: taxonomies,
                outputDir: outputDir,
                taxonomyFolderName: taxonomiesFolderName,
                addTimestamp: config.addTimestamp,
                fileResolver: config.taxonomyTypeFileResolver,
                taxonomyResolver: config.taxonomyTypeResolver
            });

            // create project structure
            const projectFiles = await projectGenerator.generateProjectModel({
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
                filenames: [
                    ...deliveryModels.contentTypeFiles.map((m) => {
                        const path = parse(m.filename);
                        return `./${path.name}`;
                    })
                ]
            });
            const contentTypeBarrelExportPath: string = `${contentTypesFolderPath}${barrelExportFilename}`;
            await fileHelper.createFileOnFsAsync(
                contentTypeBarrelCode,
                contentTypeBarrelExportPath,
                config.formatOptions
            );

            // content type snippets
            for (const file of deliveryModels.snippetFiles) {
                await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
            }
            const contentTypeSnippetsBarrelCode = commonHelper.getBarrelExportCode({
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
                filenames: [
                    ...taxonomyFiles.map((m) => {
                        const path = parse(m.filename);
                        return `./${path.name}`;
                    })
                ]
            });
            const taxonomiesBarrelExportPath: string = `${taxonomiesFolderPath}${barrelExportFilename}`;
            await fileHelper.createFileOnFsAsync(
                taxonomiesBarrelCode,
                taxonomiesBarrelExportPath,
                config.formatOptions
            );

            // project barrel
            for (const file of projectFiles) {
                await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
            }
            const projectBarrelCode = commonHelper.getBarrelExportCode({
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
                filenames: [
                    `./${projectFolderName}`,
                    `./${contentTypesFolderName}`,
                    `./${contentTypeSnippetsFolderName}`,
                    `./${taxonomiesFolderName}`
                ]
            });
            const mainBarrelExportPath: string = `${outputDir}${barrelExportFilename}`;
            await fileHelper.createFileOnFsAsync(mainBarrelCode, mainBarrelExportPath, config.formatOptions);
        } else if (config.sdkType === 'management') {
            console.log('Not available yet');
        } else {
            throw Error(`Unsupported 'sdkType'. Supported values are: delivery, management`);
        }
        console.log(Colors.green(`\nCompleted`));
    } catch (error) {
        console.log(Colors.red(`Failed with error:`));
        throw error;
    }
}
