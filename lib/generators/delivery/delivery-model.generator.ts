import { ElementType, IContentType } from '@kentico/kontent-delivery';
import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper } from '../../common-helper';
import { textHelper } from '../../text-helper';
import { format, Options } from 'prettier';
import { ContentTypeResolver, ElementResolver, FileNameResolver } from '../../models';

export class DeliveryModelGenerator {
    async generateModelsAsync(config: {
        types: IContentType[];
        addTimestamp: boolean;
        secureAccessKey?: string;
        elementResolver?: ElementResolver;
        fileResolver?: FileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        formatOptions?: Options;
    }): Promise<void> {
        if (config.elementResolver) {
            console.log(
                `Using '${yellow(
                    config.elementResolver instanceof Function ? 'custom' : config.elementResolver
                )}' name resolver for content type elements`
            );
        }

        if (config.fileResolver) {
            console.log(
                `Using '${yellow(
                    config.fileResolver instanceof Function ? 'custom' : config.fileResolver
                )}' name resolver for filenames`
            );
        }

        if (config.contentTypeResolver) {
            console.log(
                `Using '${yellow(
                    config.contentTypeResolver instanceof Function ? 'custom' : config.contentTypeResolver
                )}' name resolver for content types`
            );
        }

        if (config.fileResolver || config.elementResolver || config.contentTypeResolver) {
            console.log('\n');
        }

        for (const type of config.types) {
            this.generateModels({
                type: type,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                elementResolver: config.elementResolver,
                secureAccessKey: config.secureAccessKey,
                fileResolver: config.fileResolver,
                contentTypeResolver: config.contentTypeResolver
            });
            console.log(
                `${yellow(this.getModelFilename({ type: type, fileResolver: config.fileResolver }))} (${
                    type.system.name
                })`
            );
        }
    }

    private getModelCode(config: {
        type: IContentType;
        addTimestamp: boolean;
        formatOptions?: Options;
        elementResolver?: ElementResolver;
        contentTypeResolver?: ContentTypeResolver;
    }): string {
        const code = `
import { IContentItem, Elements } from '@kentico/kontent-delivery';

/**
 * ${commonHelper.getAutogenerateNote(config.addTimestamp)}
*/
export type ${this.getContentTypeName({
            type: config.type,
            contentTypeResolver: config.contentTypeResolver
        })} = IContentItem<{
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
        fileResolver?: FileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
    }): void {
        const classFileName = this.getModelFilename({ type: data.type, fileResolver: data.fileResolver });
        const code = this.getModelCode({
            type: data.type,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            elementResolver: data.elementResolver,
            contentTypeResolver: data.contentTypeResolver
        });

        fs.writeFileSync('./' + classFileName, code);
    }

    private getContentTypeName(data: { type: IContentType; contentTypeResolver?: ContentTypeResolver }): string {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.type.system.codename);
        }

        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.type)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.type.system.codename, data.contentTypeResolver)}`;
    }

    private getModelFilename(data: { type: IContentType; fileResolver?: FileNameResolver }): string {
        if (!data.fileResolver) {
            return `${data.type.system.codename}.ts`;
        }

        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.type)}.ts`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.type.system.codename, data.fileResolver)}.ts`;
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

        return textHelper.resolveTextWithDefaultResolver(config.elementName, config.elementResolver);
    }
}

export const deliveryModelGenerator = new DeliveryModelGenerator();
