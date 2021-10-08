import { ElementType } from '@kentico/kontent-delivery';
import { generatorConfig } from './config';
import { CodeType, ModuleResolution } from './enums';
import { utilities } from './utilities';
export class ModelHelper {
    getFullClassFileName(opts) {
        if (opts.codeType === CodeType.JavaScript) {
            return this.getClassFilename(opts.type) + '.js';
        }
        else if (opts.codeType === CodeType.TypeScript) {
            return this.getClassFilename(opts.type) + '.ts';
        }
        throw Error(`Unsupported code type '${opts.codeType}'`);
    }
    getClassDefinition(opts) {
        let definition = `
${this.getImports(opts.type, opts.moduleResolution, opts.codeType).join('\n')}
${opts.codeType === CodeType.TypeScript ? generatorConfig.getNotice('ts', opts.addTimestamp) : generatorConfig.getNotice('js', opts.addTimestamp)}
${this.getExportClass(opts.type, opts.moduleResolution)}
    `;
        // include fields only for ts
        if (opts.codeType === CodeType.TypeScript) {
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
        if (moduleResolution === ModuleResolution.ES2015) {
            return `export class ${this.getClassName(type)} extends ${generatorConfig.itemBaseClass} {`;
        }
        else if (moduleResolution === ModuleResolution.CommonJs) {
            return `export class ${this.getClassName(type)} extends ${generatorConfig.CommonJsRequiredName}.${generatorConfig.itemBaseClass} {`;
        }
        throw Error(`Unsupported module type '${moduleResolution}'`);
    }
    getImports(type, moduleType, codeType) {
        let requiredImport;
        if (moduleType === ModuleResolution.CommonJs && codeType === CodeType.TypeScript) {
            requiredImport = `import * as ${generatorConfig.CommonJsRequiredName} from '${generatorConfig.npmPackage}';`;
        }
        else if (moduleType === ModuleResolution.ES2015) {
            requiredImport = `import { ${generatorConfig.itemBaseClass}, ${generatorConfig.elementsNamespace} } from '${generatorConfig.npmPackage}';`;
        }
        else if (moduleType === ModuleResolution.CommonJs) {
            requiredImport = `var ${generatorConfig.CommonJsRequiredName} = require('${generatorConfig.npmPackage}');`;
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
        return `${moduleResolution === ModuleResolution.CommonJs ? (generatorConfig.CommonJsRequiredName + '.') : ''}`;
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
            ${generatorConfig.propertyResolver}: ((elementName${codeType === CodeType.TypeScript ? ': string' : ''}) => {
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
        if (!generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return false;
        }
        return codename.indexOf('_') !== -1;
    }
    getPropertyName(codename) {
        if (!generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return codename;
        }
        return utilities.toPascalCase(codename);
    }
    getClassName(type) {
        return utilities.toPascalCase(utilities.capitalizeFirstLetter(type.system.codename));
    }
    getClassFilename(type) {
        return type.system.codename;
    }
    mapElementTypeToName(elementType) {
        let result = '';
        if (elementType.toLowerCase() === ElementType.Text.toLowerCase()) {
            result = 'TextElement';
        }
        else if (elementType.toLowerCase() === ElementType.Number.toLowerCase()) {
            result = 'NumberElement';
        }
        else if (elementType.toLowerCase() === ElementType.ModularContent.toLowerCase()) {
            result = `LinkedItemsElement<${generatorConfig.itemBaseClass}>`;
        }
        else if (elementType.toLowerCase() === ElementType.Asset.toLowerCase()) {
            result = 'AssetsElement';
        }
        else if (elementType.toLowerCase() === ElementType.DateTime.toLowerCase()) {
            result = 'DateTimeElement';
        }
        else if (elementType.toLowerCase() === ElementType.RichText.toLowerCase()) {
            result = 'RichTextElement';
        }
        else if (elementType.toLowerCase() === ElementType.MultipleChoice.toLowerCase()) {
            result = 'MultipleChoiceElement';
        }
        else if (elementType.toLowerCase() === ElementType.UrlSlug.toLowerCase()) {
            result = 'UrlSlugElement';
        }
        else if (elementType.toLowerCase() === ElementType.Taxonomy.toLowerCase()) {
            result = 'TaxonomyElement';
        }
        else if (elementType.toLowerCase() === ElementType.Custom.toLowerCase()) {
            result = 'CustomElement';
        }
        else {
            console.warn(`Unsupported element type '${elementType}'`);
        }
        return generatorConfig.elementsNamespace + '.' + result;
    }
}
export const modelHelper = new ModelHelper();
//# sourceMappingURL=model-helper.js.map