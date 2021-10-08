"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilities = exports.Utilities = void 0;
const enums_1 = require("./enums");
class Utilities {
    getModuleResolution(moduleResolution) {
        if (moduleResolution.toLowerCase() === enums_1.ModuleResolution.ES2015.toLowerCase()) {
            return enums_1.ModuleResolution.ES2015;
        }
        if (moduleResolution.toLowerCase() === enums_1.ModuleResolution.CommonJs.toLowerCase()) {
            return enums_1.ModuleResolution.CommonJs;
        }
        throw Error(`Invalid module resolution option '${moduleResolution}'`);
    }
    getCodeType(codeType) {
        if (codeType.toLowerCase() === enums_1.CodeType.JavaScript.toLowerCase()) {
            return enums_1.CodeType.JavaScript;
        }
        if (codeType.toLowerCase() === enums_1.CodeType.TypeScript.toLowerCase()) {
            return enums_1.CodeType.TypeScript;
        }
        throw Error(`Invalid code type option '${codeType}'`);
    }
    capitalizeFirstLetter(text) {
        if (!text) {
            return '';
        }
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    toPascalCase(text) {
        if (!text) {
            return '';
        }
        let pascalCaseName = '';
        const arr = text.split('_');
        for (let i = 0; i < arr.length; i++) {
            let part = arr[i];
            if (i > 0) {
                part = this.capitalizeFirstLetter(part);
            }
            pascalCaseName += part;
        }
        return pascalCaseName;
    }
}
exports.Utilities = Utilities;
exports.utilities = new Utilities();
//# sourceMappingURL=utilities.js.map