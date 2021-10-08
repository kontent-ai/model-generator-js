import { IContentType, DeliveryClient } from '@kentico/kontent-delivery';
import * as fs from 'fs';

import { modelHelper } from './model-helper';
import { Options } from 'prettier';
import { green, red, yellow } from 'colors';

export class Generator {
    private readonly deliveryClient: DeliveryClient;

    public readonly projectId: string;
    public readonly secureAccessKey?: string;
    public readonly addTimestamp: boolean;

    constructor(config: { projectId: string; addTimestamp: boolean; secureAccessKey?: string }) {
        this.projectId = config.projectId;
        this.secureAccessKey = config.secureAccessKey;
        this.addTimestamp = config.addTimestamp;

        // init delivery client
        this.deliveryClient = new DeliveryClient({
            projectId: this.projectId,
            secureApiKey: config.secureAccessKey,
            defaultQueryConfig: {
                useSecuredMode: config.secureAccessKey ? true : false
            }
        });
    }

    async generateModelsAsync(config?: { formatOptions: Options }): Promise<void> {
        console.log(green(`Model generator started \n`));

        try {
            const types = (await this.deliveryClient.types().toAllPromise()).data.items;

            console.log(`Found '${types.length}' content types: \n`);

            for (const type of types) {
                this.generateClass({
                    type: type,
                    formatOptions: config?.formatOptions
                });
                console.log(`${yellow(modelHelper.getFilename({ type: type }))} (${type.system.name})`);
            }

            console.log(green(`\nModel generator completed`));
        } catch (error) {
            console.log(red(`Failed with error:`));
            console.log(error);
            throw error;
        }
    }

    private generateClass(config: { formatOptions?: Options; type: IContentType }): void {
        const classFileName = modelHelper.getFilename({ type: config.type });
        const code = modelHelper.getClassDefinition({
            type: config.type,
            addTimestamp: this.addTimestamp,
            formatOptions: config.formatOptions
        });

        // create file
        fs.writeFileSync('./' + classFileName, code);
    }
}
