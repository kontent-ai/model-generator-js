import { IContentType, DeliveryClient } from '@kentico/kontent-delivery';
import * as fs from 'fs';
import { name } from '../package.json';

import { modelHelper } from './model-helper';

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

    async generateModelsAsync(): Promise<void> {
        console.log(`${name} started`);

        try {
            const types = (await this.deliveryClient.types().toAllPromise()).data.items;

            for (const type of types) {
                this.generateClass(type);
            }
        } catch (error) {
            console.log(`${name} failed with error:`);
            console.log(error);
            throw error;
        }
    }

    private generateClass(type: IContentType): void {
        const classFileName = modelHelper.getFilename({ type: type });
        const classContent = modelHelper.getClassDefinition({
            type: type,
            addTimestamp: this.addTimestamp
        });

        // create class file
        fs.writeFile('./' + classFileName, classContent, (error) => {
            if (error) {
                throw Error(`Could not create class file '${classFileName}'`);
            }
            console.log(`Class '${classFileName}' was created`);
        });
    }
}
