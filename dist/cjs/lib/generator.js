"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const kontent_delivery_1 = require("@kentico/kontent-delivery");
const fs = require("fs");
const package_json_1 = require("../package.json");
const model_helper_1 = require("./model-helper");
class Generator {
    constructor(config) {
        this.projectId = config.projectId;
        this.secureAccessKey = config.secureAccessKey;
        this.addTimestamp = config.addTimestamp;
        // init delivery client
        this.deliveryClient = new kontent_delivery_1.DeliveryClient({
            projectId: this.projectId,
            secureApiKey: config.secureAccessKey,
            defaultQueryConfig: {
                useSecuredMode: config.secureAccessKey ? true : false
            }
        });
    }
    generateModelsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${package_json_1.name} started`);
            try {
                const types = (yield this.deliveryClient.types().toAllPromise()).data.items;
                for (const type of types) {
                    this.generateClass(type);
                }
            }
            catch (error) {
                console.log(`${package_json_1.name} failed with error:`);
                console.log(error);
                throw error;
            }
        });
    }
    generateClass(type) {
        const classFileName = model_helper_1.modelHelper.getFilename({ type: type });
        const classContent = model_helper_1.modelHelper.getClassDefinition({
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
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map