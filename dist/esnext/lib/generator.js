import { DeliveryClient } from '@kentico/kontent-delivery';
import * as fs from 'fs';
import { finalize, map } from 'rxjs/operators';
import { modelHelper } from './model-helper';
export class Generator {
    constructor(config) {
        Object.assign(this, config);
        // init delivery client
        this.deliveryClient = new DeliveryClient({
            projectId: this.projectId,
            secureApiKey: config.secureAccessKey,
            globalQueryConfig: {
                useSecuredMode: config.secureAccessKey ? true : false
            }
        });
    }
    startModelGenerator() {
        console.log('Kontent generator started ...');
        // get data from Kentico Kontent and generate classes out of given project
        this.deliveryClient
            .types()
            .toObservable()
            .pipe(map(typesResponse => {
            typesResponse.types.forEach(type => {
                // generate class
                this.generateClass(type);
            });
        }), finalize(() => {
            console.log('Generator finished');
        }))
            .subscribe(() => undefined, (err) => {
            console.log(`Generator failed with error:`);
            console.log(err);
            throw Error(err);
        });
    }
    generateClass(type) {
        if (!type) {
            throw Error('Invalid type');
        }
        const classFileName = modelHelper.getFullClassFileName({ type: type, codeType: this.codeType });
        const classContent = modelHelper.getClassDefinition({
            type: type,
            moduleResolution: this.moduleResolution,
            codeType: this.codeType,
            strictPropertyInitalization: this.strictPropertyInitalization,
            addTimestamp: this.addTimestamp
        });
        // create class file
        fs.writeFile('./' + classFileName, classContent, error => {
            if (error) {
                throw Error(`Could not create class file '${classFileName}'`);
            }
            console.log(`Class '${classFileName}' was created`);
        });
    }
}
//# sourceMappingURL=generator.js.map