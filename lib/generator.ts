import { IContentType, DeliveryClient } from '@kentico/kontent-delivery';
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

        console.log(`Found '${yellow(types.length.toString())}' content types \n`);

        if (config.nameResolver) {
            console.log(`Using '${yellow(config.nameResolver)}' name resolver\n`);
        }

        if (config.customNameResolver) {
            console.log(`Using '${yellow('custom')}' name resolver\n`);
        }

        for (const type of types) {
            generateClass(type, config);
            console.log(`${yellow(modelHelper.getFilename({ type: type }))} (${type.system.name})`);
        }

        console.log(green(`\nModel generator completed`));
    } catch (error) {
        console.log(red(`Failed with error:`));
        console.log(error);
        throw error;
    }
}

function generateClass(type: IContentType, config: IGenerateModelsConfig): void {
    const classFileName = modelHelper.getFilename({ type: type });
    const code = modelHelper.getClassDefinition({
        type: type,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        nameResolver: config.nameResolver,
        includeCodename: config.includeCodename,
        customNameResolver: config.customNameResolver
    });

    // create file
    fs.writeFileSync('./' + classFileName, code);
}
