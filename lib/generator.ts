import { green, red, yellow } from 'colors';
import * as fs from 'fs';
import { IGenerateModelsConfig } from './models';
import { deliveryContentTypeGenerator } from './generators/delivery/delivery-content-type.generator';
import { deliveryProjectGenerator } from './generators';
import { createManagementClient } from '@kentico/kontent-management';
import { deliveryTaxonomylGenerator as deliveryTaxonomyGenerator } from './generators/delivery/delivery-taxonomy.generator';
import { commonHelper } from './common-helper';
import { parse } from 'path';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(green(`Model generator started \n`));

    const contentTypesFolderPath: string = 'content-types/';
    const taxonomiesFolderPath: string = 'taxonomies/';

    try {
        if (config.sdkType === 'delivery') {
            console.log(`Generating '${yellow('delivery')}' models\n`);

            // prepare directories
            fs.mkdirSync(contentTypesFolderPath, { recursive: true });
            fs.mkdirSync(taxonomiesFolderPath, { recursive: true });

            const deliveryClient = createManagementClient({
                projectId: config.projectId,
                apiKey: config.apiKey
            });

            const types = (await deliveryClient.listContentTypes().toAllPromise()).data.items;
            const languages = (await deliveryClient.listLanguages().toAllPromise()).data.items;
            const taxonomies = (await deliveryClient.listTaxonomies().toAllPromise()).data.items;
            const projectInformation = (await deliveryClient.projectInformation().toPromise()).data;

            console.log(`Project '${yellow(projectInformation.project.name)}'`);
            console.log(`Environment '${yellow(projectInformation.project.environment)}\n`);

            console.log(`Found '${yellow(types.length.toString())}' types`);
            console.log(`Found '${yellow(languages.length.toString())}' languages`);
            console.log(`Found '${yellow(taxonomies.length.toString())}' taxonomies \n`);

            // create content type models
            const contentTypesResult = await deliveryContentTypeGenerator.generateModelsAsync({
                types: types,
                typeFolderPath: contentTypesFolderPath,
                taxonomyFolderPath: taxonomiesFolderPath,
                taxonomies: taxonomies,
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
            const projectModelResult = await deliveryProjectGenerator.generateProjectModel({
                projectInformation: projectInformation.project,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                languages: languages,
                taxonomies: taxonomies,
                types: types
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

            // main barrel
            const mainBarrelCode = commonHelper.getBarrelExportCode({
                filenames: [
                    ...projectModelResult.filenames,
                    `./${contentTypesFolderPath}`,
                    `./${taxonomiesFolderPath}`
                ],
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

        console.log(green(`\nModel generator completed`));
    } catch (error) {
        console.log(red(`Failed with error:`));
        console.log(error);
        throw error;
    }
}
