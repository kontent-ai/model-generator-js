import {
    camelCasePropertyNameResolver,
    ElementType,
    IContentType,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver
} from '@kentico/kontent-delivery';
import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper } from '../../common-helper';
import { format, Options } from 'prettier';
import { ElementResolver } from '../../models';

export class DeliveryModelGenerator {
    async generateModelsAsync(config: {
        types: IContentType[];
        addTimestamp: boolean;
        secureAccessKey?: string;
        elementResolver?: ElementResolver;
        formatOptions?: Options;
    }): Promise<void> {
        if (config.elementResolver) {
            console.log(
                `Using '${yellow(
                    config.elementResolver instanceof Function ? 'custom' : config.elementResolver
                )}' name resolver for content type elements\n`
            );
        }

        for (const type of config.types) {
            this.generateModels({
                type: type,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                elementResolver: config.elementResolver,
                secureAccessKey: config.secureAccessKey
            });
            console.log(`${yellow(this.getModelFilename({ type: type }))} (${type.system.name})`);
        }
    }

    private getModelCode(config: {
        type: IContentType;
        addTimestamp: boolean;
        formatOptions?: Options;
        elementResolver?: ElementResolver;
    }): string {
        const code = `
import { IContentItem, Elements } from '@kentico/kontent-delivery';

/**
 * ${commonHelper.getAutogenerateNote(config.addTimestamp)}
*/
export type ${commonHelper.toPascalCase(config.type.system.codename)} = IContentItem<{
    ${this.getElementsCode({
        type: config.type,
        elementResolver: config.elementResolver
    })}
}>;
`;
        const formatOptions: Options = config.formatOptions
            ? config.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    private generateModels(data: {
        type: IContentType;
        addTimestamp: boolean;
        secureAccessKey?: string;
        elementResolver?: ElementResolver;
        formatOptions?: Options;
    }): void {
        const classFileName = this.getModelFilename({ type: data.type });
        const code = this.getModelCode({
            type: data.type,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            elementResolver: data.elementResolver
        });

        fs.writeFileSync('./' + classFileName, code);
    }

    private getModelFilename(data: { type: IContentType }): string {
        return `${data.type.system.codename}.ts`;
    }

    private getElementsCode(data: { type: IContentType; elementResolver?: ElementResolver }): string {
        let code = '';
        for (let i = 0; i < data.type.elements.length; i++) {
            const element = data.type.elements[i];
            code += `${this.getElementName({
                elementName: element.codename,
                type: data.type.system.codename,
                elementResolver: data.elementResolver
            })}: Elements.${this.mapElementTypeToName(element.type)};`;

            if (i !== data.type.elements.length - 1) {
                code += '\n';
            }
        }

        return code;
    }

    private mapElementTypeToName(elementType: string): string {
        let result: string = '';
        if (elementType.toLowerCase() === ElementType.Text.toLowerCase()) {
            result = 'TextElement';
        } else if (elementType.toLowerCase() === ElementType.Number.toLowerCase()) {
            result = 'NumberElement';
        } else if (elementType.toLowerCase() === ElementType.ModularContent.toLowerCase()) {
            result = `LinkedItemsElement<IContentItem>`;
        } else if (elementType.toLowerCase() === ElementType.Asset.toLowerCase()) {
            result = 'AssetsElement';
        } else if (elementType.toLowerCase() === ElementType.DateTime.toLowerCase()) {
            result = 'DateTimeElement';
        } else if (elementType.toLowerCase() === ElementType.RichText.toLowerCase()) {
            result = 'RichTextElement';
        } else if (elementType.toLowerCase() === ElementType.MultipleChoice.toLowerCase()) {
            result = 'MultipleChoiceElement';
        } else if (elementType.toLowerCase() === ElementType.UrlSlug.toLowerCase()) {
            result = 'UrlSlugElement';
        } else if (elementType.toLowerCase() === ElementType.Taxonomy.toLowerCase()) {
            result = 'TaxonomyElement';
        } else if (elementType.toLowerCase() === ElementType.Custom.toLowerCase()) {
            result = 'CustomElement';
        } else {
            console.warn(`Unsupported element type '${elementType}'`);
        }
        return result;
    }

    private getElementName(config: { type: string; elementName: string; elementResolver?: ElementResolver }): string {
        if (!config.elementResolver) {
            return config.elementName;
        }

        if (config.elementResolver instanceof Function) {
            return config.elementResolver(config.type, config.elementName);
        }

        if (config.elementResolver === 'camelCase') {
            return camelCasePropertyNameResolver(config.type, config.elementName);
        }

        if (config.elementResolver === 'pascalCase') {
            return pascalCasePropertyNameResolver(config.type, config.elementName);
        }

        if (config.elementResolver === 'snakeCase') {
            return snakeCasePropertyNameResolver(config.type, config.elementName);
        }

        throw Error(
            `Invalid name resolver '${config.elementResolver}'. Available options are: camelCase, pascalCase, snakeCase`
        );
    }
}

export const deliveryModelGenerator = new DeliveryModelGenerator();
