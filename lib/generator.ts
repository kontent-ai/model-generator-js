import { green, red, yellow } from 'colors';
import * as fs from 'fs';
import { IGenerateModelsConfig } from './models';
import { deliveryContentTypeGenerator } from './generators/delivery/delivery-content-type.generator';
import { projectGenerator } from './generators';
import {
    AssetFolderModels,
    CollectionModels,
    createManagementClient,
    LanguageModels,
    RoleModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { deliveryTaxonomylGenerator as deliveryTaxonomyGenerator } from './generators/delivery/delivery-taxonomy.generator';
import { commonHelper } from './common-helper';
import { parse } from 'path';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(green(`Model generator started \n`));

    const contentTypesFolderPath: string = 'content-types/';
    const taxonomiesFolderPath: string = 'taxonomies/';
    const projectFolderPath: string = 'project/';

    try {
        if (config.sdkType === 'delivery') {
            console.log(`Generating '${yellow('delivery')}' models\n`);

            // prepare directories
            fs.mkdirSync(contentTypesFolderPath, { recursive: true });
            fs.mkdirSync(taxonomiesFolderPath, { recursive: true });
            fs.mkdirSync(projectFolderPath, { recursive: true });

            const managementClient = createManagementClient({
                projectId: config.projectId,
                apiKey: config.apiKey
            });

            const projectInformation = (await managementClient.projectInformation().toPromise()).data;
            console.log(`Project '${yellow(projectInformation.project.name)}'`);
            console.log(`Environment '${yellow(projectInformation.project.environment)}'\n`);

            const types = (await managementClient.listContentTypes().toAllPromise()).data.items;
            const snippets = (await managementClient.listContentTypeSnippets().toAllPromise()).data.items;
            const taxonomies = (await managementClient.listTaxonomies().toAllPromise()).data.items;

            console.log(`Found '${yellow(types.length.toString())}' types`);
            console.log(`Found '${yellow(snippets.length.toString())}' content type snippets`);
            console.log(`Found '${yellow(taxonomies.length.toString())}' taxonomies`);

            const workflows: WorkflowModels.Workflow[] = [];
            const roles: RoleModels.Role[] = [];
            const assetFolders: AssetFolderModels.AssetFolder[] = [];
            const collections: CollectionModels.Collection[] = [];
            const webhooks: WebhookModels.Webhook[] = [];
            const languages: LanguageModels.LanguageModel[] = [];

            const exportAllProjectSettings = config.exportProjectSettings ? false : true;

            if (config.exportProjectSettings?.exportWorkflows || exportAllProjectSettings) {
                workflows.push(...(await managementClient.listWorkflows().toPromise()).data);
                console.log(`Found '${yellow(workflows.length.toString())}' workflows`);
            } else {
                console.log(`Skipping '${red('workflows')}' export`);
            }

            if (config.exportProjectSettings?.exportRoles || exportAllProjectSettings) {
                roles.push(...(await managementClient.listRoles().toPromise()).data.roles);
                console.log(`Found '${yellow(roles.length.toString())}' roles`);
            } else {
                console.log(`Skipping '${red('roles')}' export`);
            }

            if (config.exportProjectSettings?.exportAssetFolders || exportAllProjectSettings) {
                assetFolders.push(...(await managementClient.listAssetFolders().toPromise()).data.items);
                console.log(
                    `Found '${yellow(projectGenerator.getAssetFoldersCount(assetFolders).toString())}' asset folders`
                );
            } else {
                console.log(`Skipping '${red('asset folders')}' export`);
            }

            if (config.exportProjectSettings?.exportCollections || exportAllProjectSettings) {
                collections.push(...(await managementClient.listCollections().toPromise()).data.collections);
                console.log(`Found '${yellow(collections.length.toString())}' collections`);
            } else {
                console.log(`Skipping '${red('collections')}' export`);
            }

            if (config.exportProjectSettings?.exportWebhooks || exportAllProjectSettings) {
                webhooks.push(...(await managementClient.listWebhooks().toPromise()).data.webhooks);
                console.log(`Found '${yellow(webhooks.length.toString())}' webhooks`);
            } else {
                console.log(`Skipping '${red('webhooks')}' export`);
            }

            if (config.exportProjectSettings?.exportLanguages || exportAllProjectSettings) {
                languages.push(...(await managementClient.listLanguages().toAllPromise()).data.items);
                console.log(`Found '${yellow(languages.length.toString())}' languages`);
            } else {
                console.log(`Skipping '${red('languages')}' export`);
            }

            console.log('');

            // create content type models
            const contentTypesResult = await deliveryContentTypeGenerator.generateModelsAsync({
                types: types,
                typeFolderPath: contentTypesFolderPath,
                taxonomyFolderPath: taxonomiesFolderPath,
                taxonomies: taxonomies,
                snippets: snippets,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                elementResolver: config.elementResolver,
                contentTypeFileNameResolver: config.contentTypeFileResolver,
                contentTypeResolver: config.contentTypeResolver,
                taxonomyFileResolver: config.taxonomyTypeFileResolver,
                taxonomyResolver: config.taxonomyTypeResolver
            });

            // create taxonomy types
            const taxonomiesResult = await deliveryTaxonomyGenerator.generateTaxonomyTypesAsync({
                taxonomies: taxonomies,
                taxonomyFolderPath: taxonomiesFolderPath,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                fileResolver: config.taxonomyTypeFileResolver,
                taxonomyResolver: config.taxonomyTypeResolver
            });

            // create project structure
            const projectModelResult = await projectGenerator.generateProjectModel({
                projectInformation: projectInformation.project,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                languages: languages,
                taxonomies: taxonomies,
                types: types,
                workflows: workflows,
                assetFolders: assetFolders,
                collections: collections,
                roles: roles,
                snippets: snippets,
                webhooks: webhooks,
                folderPath: projectFolderPath
            });

            // create barrel export
            const barrelExportFilename: string = 'index.ts';

            // content types barrel
            const contentTypeBarrelCode = commonHelper.getBarrelExportCode({
                filenames: [
                    ...contentTypesResult.filenames.map((m) => {
                        const path = parse(m);
                        return `./${path.name}`;
                    })
                ],
                formatOptions: config.formatOptions
            });
            const contentTypeBarrelExportPath: string = `./${contentTypesFolderPath}${barrelExportFilename}`;
            fs.writeFileSync(contentTypeBarrelExportPath, contentTypeBarrelCode);
            console.log(`\nBarrel export '${yellow(contentTypeBarrelExportPath)}' created`);

            // taxonomies barrel
            const taxonomiesBarrelCode = commonHelper.getBarrelExportCode({
                filenames: [
                    ...taxonomiesResult.filenames.map((m) => {
                        const path = parse(m);
                        return `./${path.name}`;
                    })
                ],
                formatOptions: config.formatOptions
            });
            const taxonomiesBarrelExportPath: string = `./${taxonomiesFolderPath}${barrelExportFilename}`;
            fs.writeFileSync(taxonomiesBarrelExportPath, taxonomiesBarrelCode);
            console.log(`Barrel export '${yellow(taxonomiesBarrelExportPath)}' created`);

            // project barrel
            const projectBarrelCode = commonHelper.getBarrelExportCode({
                filenames: [
                    ...projectModelResult.filenames.map((m) => {
                        const path = parse(m);
                        return `./${path.name}`;
                    })
                ],
                formatOptions: config.formatOptions
            });
            const projectBarrelExportPath: string = `./${projectFolderPath}${barrelExportFilename}`;
            fs.writeFileSync(projectBarrelExportPath, projectBarrelCode);
            console.log(`Barrel export '${yellow(projectBarrelExportPath)}' created`);

            // main barrel
            const mainBarrelCode = commonHelper.getBarrelExportCode({
                filenames: [`./${projectFolderPath}`, `./${contentTypesFolderPath}`, `./${taxonomiesFolderPath}`],
                formatOptions: config.formatOptions
            });
            const mainBarrelExportPath: string = `./${barrelExportFilename}`;
            fs.writeFileSync(mainBarrelExportPath, mainBarrelCode);
            console.log(`Barrel export '${yellow(mainBarrelExportPath)}' created`);
        } else if (config.sdkType === 'management') {
            console.log('Not available yet');
        } else {
            throw Error(`Unsupported 'sdkType'. Supported values are: delivery, management`);
        }

        console.log(green(`\nCompleted`));
    } catch (error) {
        console.log(red(`Failed with error:`));
        console.log(error);
        throw error;
    }
}
