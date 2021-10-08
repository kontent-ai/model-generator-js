import { IContentType, DeliveryClient } from '@kentico/kontent-delivery';
import * as fs from 'fs';

import { modelHelper } from './model-helper';
import { Options } from 'prettier';
import { green, red, yellow } from 'colors';
import { PropertyNameResolverType } from './models';

export class Generator {
    private readonly deliveryClient: DeliveryClient;

    public readonly projectId: string;
    public readonly addTimestamp: boolean;

    public readonly secureAccessKey?: string;
    public readonly nameResolver?: PropertyNameResolverType;

    constructor(config: {
        projectId: string;
        addTimestamp: boolean;
        secureAccessKey?: string;
        nameResolver?: PropertyNameResolverType;
    }) {
        this.projectId = config.projectId;
        this.secureAccessKey = config.secureAccessKey;
        this.addTimestamp = config.addTimestamp;
        this.addTimestamp = config.addTimestamp;
        this.nameResolver = config.nameResolver;

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

            console.log(`Found '${yellow(types.length.toString())}' content types \n`);

            if (this.nameResolver) {
                console.log(`Using '${yellow(this.nameResolver)}' name resolver\n`);
            }

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
            formatOptions: config.formatOptions,
            nameResolver: this.nameResolver
        });

        // create file
        fs.writeFileSync('./' + classFileName, code);
    }
}
