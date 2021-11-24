import { green, red, yellow } from 'colors';
import { IGenerateModelsConfig } from './models';
import { deliveryModelGenerator } from './generators/delivery/delivery-model.generator';
import { deliveryProjectGenerator } from './generators';
import { createDeliveryClient } from '@kentico/kontent-delivery';

export async function generateModelsAsync(config: IGenerateModelsConfig): Promise<void> {
    console.log(green(`Model generator started \n`));

    try {
        if (config.sdkType === 'delivery') {
            console.log(`Generating '${yellow('delivery')}' models\n`);

            const deliveryClient = createDeliveryClient({
                projectId: config.projectId,
                secureApiKey: config.secureAccessKey,
                defaultQueryConfig: {
                    useSecuredMode: config.secureAccessKey ? true : false
                }
            });

            const types = (await deliveryClient.types().toAllPromise()).data.items;
            const languages = (await deliveryClient.languages().toAllPromise()).data.items;
            const taxonomies = (await deliveryClient.taxonomies().toAllPromise()).data.items;

            console.log(`Found '${yellow(types.length.toString())}' types`);
            console.log(`Found '${yellow(languages.length.toString())}' languages`);
            console.log(`Found '${yellow(taxonomies.length.toString())}' taxonomies \n`);

            // create models
            await deliveryModelGenerator.generateModelsAsync({
                types: types,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                elementResolver: config.elementResolver,
                secureAccessKey: config.secureAccessKey,
                fileResolver: config.fileResolver,
                contentTypeResolver: config.contentTypeResolver
            });

            // create project structure
            await deliveryProjectGenerator.generateProjectModel({
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                languages: languages,
                taxonomies: taxonomies,
                types: types
            });
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
