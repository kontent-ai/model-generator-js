import { IContentType, DeliveryClient, ILanguage, ITaxonomyGroup } from '@kentico/kontent-delivery';
import * as fs from 'fs';

import { modelHelper } from './model-helper';
import { green, red, yellow } from 'colors';
import { IGenerateModelsConfig } from './models';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(green(`Model generator started \n`));

    try {
        const deliveryClient = new DeliveryClient({
            projectId: config.projectId,
            secureApiKey: config.secureAccessKey,
            defaultQueryConfig: {
                useSecuredMode: config.secureAccessKey ? true : false
            }
        });
        const types = (await deliveryClient.types().toAllPromise()).data.items;
        const languages = (await deliveryClient.languages().toAllPromise()).data.items;
        const taxonomies = (await deliveryClient.taxonomies().toAllPromise()).data.items;

        console.log(`Found '${yellow(types.length.toString())}' languages`);
        console.log(`Found '${yellow(languages.length.toString())}' content types`);
        console.log(`Found '${yellow(taxonomies.length.toString())}' taxonomies \n`);

        if (config.nameResolver) {
            console.log(`Using '${yellow(config.nameResolver)}' name resolver for content type elements\n`);
        }

        if (config.customNameResolver) {
            console.log(`Using '${yellow('custom')}' name resolver for content type elements\n`);
        }

        for (const type of types) {
            generateModels(type, config);
            console.log(`${yellow(modelHelper.getModelFilename({ type: type }))} (${type.system.name})`);
        }

        generateProjectModel(types, languages, taxonomies, config);
        console.log(`\nProject structure '${yellow(modelHelper.getProjectModelFilename())}'`);

        console.log(green(`\nModel generator completed`));
    } catch (error) {
        console.log(red(`Failed with error:`));
        console.log(error);
        throw error;
    }
}

function generateProjectModel(types: IContentType[], languages: ILanguage[], taxonomies: ITaxonomyGroup[], config: IGenerateModelsConfig): void {
    const classFileName = modelHelper.getProjectModelFilename();
    const code = modelHelper.getProjectModelCode({
        types: types,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        languages: languages,
        taxonomies: taxonomies
    });

    fs.writeFileSync('./' + classFileName, code);
}

function generateModels(type: IContentType, config: IGenerateModelsConfig): void {
    const classFileName = modelHelper.getModelFilename({ type: type });
    const code = modelHelper.getModelCode({
        type: type,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        nameResolver: config.nameResolver,
        customNameResolver: config.customNameResolver
    });

    fs.writeFileSync('./' + classFileName, code);
}
