"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const kontent_delivery_1 = require("@kentico/kontent-delivery");
const fs = require("fs");
const operators_1 = require("rxjs/operators");
const model_helper_1 = require("./model-helper");
class Generator {
    constructor(config) {
        Object.assign(this, config);
        // init delivery client
        this.deliveryClient = new kontent_delivery_1.DeliveryClient({
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
            .pipe((0, operators_1.map)(typesResponse => {
            typesResponse.types.forEach(type => {
                // generate class
                this.generateClass(type);
            });
        }), (0, operators_1.finalize)(() => {
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
        const classFileName = model_helper_1.modelHelper.getFullClassFileName({ type: type, codeType: this.codeType });
        const classContent = model_helper_1.modelHelper.getClassDefinition({
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
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map