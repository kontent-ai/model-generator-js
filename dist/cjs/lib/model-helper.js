"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelHelper = exports.ModelHelper = void 0;
const kontent_delivery_1 = require("@kentico/kontent-delivery");
const config_1 = require("./config");
const enums_1 = require("./enums");
const utilities_1 = require("./utilities");
class ModelHelper {
    getFullClassFileName(opts) {
        if (opts.codeType === enums_1.CodeType.JavaScript) {
            return this.getClassFilename(opts.type) + '.js';
        }
        else if (opts.codeType === enums_1.CodeType.TypeScript) {
            return this.getClassFilename(opts.type) + '.ts';
        }
        throw Error(`Unsupported code type '${opts.codeType}'`);
    }
    getClassDefinition(opts) {
        let definition = `
${this.getImports(opts.type, opts.moduleResolution, opts.codeType).join('\n')}
${opts.codeType === enums_1.CodeType.TypeScript ? config_1.generatorConfig.getNotice('ts', opts.addTimestamp) : config_1.generatorConfig.getNotice('js', opts.addTimestamp)}
${this.getExportClass(opts.type, opts.moduleResolution)}
    `;
        // include fields only for ts
        if (opts.codeType === enums_1.CodeType.TypeScript) {
            definition += `${this.getContentTypeElements(opts.type, opts.moduleResolution, opts.strictPropertyInitalization).join(`
    `).trim()}
`;
        }
        const constructor = this.getConstructor(opts.type, opts.codeType);
        if (constructor) {
            definition += constructor;
        }
        definition += `}
`;
        return definition;
    }
    getExportClass(type, moduleResolution) {
        if (moduleResolution === enums_1.ModuleResolution.ES2015) {
            return `export class ${this.getClassName(type)} extends ${config_1.generatorConfig.itemBaseClass} {`;
        }
        else if (moduleResolution === enums_1.ModuleResolution.CommonJs) {
            return `export class ${this.getClassName(type)} extends ${config_1.generatorConfig.CommonJsRequiredName}.${config_1.generatorConfig.itemBaseClass} {`;
        }
        throw Error(`Unsupported module type '${moduleResolution}'`);
    }
    getImports(type, moduleType, codeType) {
        let requiredImport;
        if (moduleType === enums_1.ModuleResolution.CommonJs && codeType === enums_1.CodeType.TypeScript) {
            requiredImport = `import * as ${config_1.generatorConfig.CommonJsRequiredName} from '${config_1.generatorConfig.npmPackage}';`;
        }
        else if (moduleType === enums_1.ModuleResolution.ES2015) {
            requiredImport = `import { ${config_1.generatorConfig.itemBaseClass}, ${config_1.generatorConfig.elementsNamespace} } from '${config_1.generatorConfig.npmPackage}';`;
        }
        else if (moduleType === enums_1.ModuleResolution.CommonJs) {
            requiredImport = `var ${config_1.generatorConfig.CommonJsRequiredName} = require('${config_1.generatorConfig.npmPackage}');`;
        }
        else {
            throw Error(`Unsupported module type '${moduleType}'`);
        }
        const imports = [requiredImport];
        return imports;
    }
    getContentTypeElements(type, moduleResolution, strictPropertyInitalization) {
        const properties = [];
        const that = this;
        type.elements.forEach(element => {
            const property = `public ${that.getPropertyName(element.codename)}${this.getStrictInitialization(strictPropertyInitalization)}: ${this.getModuleResolution(moduleResolution)}${that.mapElementTypeToName(element.type)};`;
            properties.push(property);
        });
        return properties;
    }
    getModuleResolution(moduleResolution) {
        return `${moduleResolution === enums_1.ModuleResolution.CommonJs ? (config_1.generatorConfig.CommonJsRequiredName + '.') : ''}`;
    }
    getStrictInitialization(strictPropertyInitalization) {
        if (strictPropertyInitalization) {
            return `!`;
        }
        return '';
    }
    getConstructor(type, codeType) {
        const fieldBindings = [];
        let explicitElementReturn = '';
        const that = this;
        type.elements.forEach(element => {
            if (that.propertyRequiresCapitalization(element.codename)) {
                const propertyName = that.getPropertyName(element.codename);
                const binding = `if (elementName === '${element.codename}') {
                    return '${propertyName}';
                }`;
                fieldBindings.push(binding);
            }
        });
        if (fieldBindings.length <= 0) {
            return undefined;
        }
        else {
            explicitElementReturn = `return elementName;`;
        }
        const constructor = `    constructor() {
        super({
            ${config_1.generatorConfig.propertyResolver}: ((elementName${codeType === enums_1.CodeType.TypeScript ? ': string' : ''}) => {
                ${fieldBindings.join(`
                `)}
                ${explicitElementReturn}
            })
        });
    }
`;
        return constructor;
    }
    propertyRequiresCapitalization(codename) {
        if (!config_1.generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return false;
        }
        return codename.indexOf('_') !== -1;
    }
    getPropertyName(codename) {
        if (!config_1.generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return codename;
        }
        return utilities_1.utilities.toPascalCase(codename);
    }
    getClassName(type) {
        return utilities_1.utilities.toPascalCase(utilities_1.utilities.capitalizeFirstLetter(type.system.codename));
    }
    getClassFilename(type) {
        return type.system.codename;
    }
    mapElementTypeToName(elementType) {
        let result = '';
        if (elementType.toLowerCase() === kontent_delivery_1.ElementType.Text.toLowerCase()) {
            result = 'TextElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.Number.toLowerCase()) {
            result = 'NumberElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.ModularContent.toLowerCase()) {
            result = `LinkedItemsElement<${config_1.generatorConfig.itemBaseClass}>`;
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.Asset.toLowerCase()) {
            result = 'AssetsElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.DateTime.toLowerCase()) {
            result = 'DateTimeElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.RichText.toLowerCase()) {
            result = 'RichTextElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.MultipleChoice.toLowerCase()) {
            result = 'MultipleChoiceElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.UrlSlug.toLowerCase()) {
            result = 'UrlSlugElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.Taxonomy.toLowerCase()) {
            result = 'TaxonomyElement';
        }
        else if (elementType.toLowerCase() === kontent_delivery_1.ElementType.Custom.toLowerCase()) {
            result = 'CustomElement';
        }
        else {
            console.warn(`Unsupported element type '${elementType}'`);
        }
        return config_1.generatorConfig.elementsNamespace + '.' + result;
    }
}
exports.ModelHelper = ModelHelper;
exports.modelHelper = new ModelHelper();
//# sourceMappingURL=model-helper.js.map