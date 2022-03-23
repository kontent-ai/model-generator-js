import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper, IGenerateResult } from '../../common-helper';
import { textHelper } from '../../text-helper';
import { nameHelper } from '../../name-helper';
import { format, Options } from 'prettier';
import { ContentTypeResolver, ElementResolver, ContentTypeFileNameResolver } from '../../models';
import { ContentTypeModels, ElementModels } from '@kentico/kontent-management';

export class DeliveryModelGenerator {
    async generateModelsAsync(config: {
        types: ContentTypeModels.ContentType[];
        addTimestamp: boolean;
        managementApiKey?: string;
        elementResolver?: ElementResolver;
        fileResolver?: ContentTypeFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        formatOptions?: Options;
    }): Promise<IGenerateResult> {
        const filenames: string[] = [];

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
                )}' name resolver for content type filename`
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
            const filename = this.generateModels({
                type: type,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                elementResolver: config.elementResolver,
                managementApiKey: config.managementApiKey,
                fileResolver: config.fileResolver,
                contentTypeResolver: config.contentTypeResolver
            });
            filenames.push(filename);
            console.log(
                `${yellow(
                    nameHelper.getDeliveryContentTypeFilename({ type: type, fileResolver: config.fileResolver })
                )} (${type.name})`
            );
        }

        return {
            filenames: filenames
        };
    }

    private getModelCode(config: {
        type: ContentTypeModels.ContentType;
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
export type ${nameHelper.getDeliveryContentTypeName({
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
        type: ContentTypeModels.ContentType;
        addTimestamp: boolean;
        managementApiKey?: string;
        elementResolver?: ElementResolver;
        formatOptions?: Options;
        fileResolver?: ContentTypeFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
    }): string {
        const classFileName = nameHelper.getDeliveryContentTypeFilename({
            type: data.type,
            fileResolver: data.fileResolver
        });
        const filename: string = './' + classFileName;
        const code = this.getModelCode({
            type: data.type,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            elementResolver: data.elementResolver,
            contentTypeResolver: data.contentTypeResolver
        });

        fs.writeFileSync(filename, code);
        return filename;
    }

    private getElementsCode(data: { type: ContentTypeModels.ContentType; elementResolver?: ElementResolver }): string {
        let code = '';
        for (let i = 0; i < data.type.elements.length; i++) {
            const element = data.type.elements[i];
            if (!element.codename) {
                throw Error(`Invalid codename for element '${element.id}' in type '${data.type.codename}'`);
            }

            const elementName = this.getElementName({
                elementName: element.codename,
                type: data.type.codename,
                elementResolver: data.elementResolver
            });

            if (!elementName) {
                // skip element if its not resolver
                continue;
            }

            code += `${elementName}: Elements.${this.mapElementTypeToName(element.type)};`;

            if (i !== data.type.elements.length - 1) {
                code += '\n';
            }
        }

        return code;
    }

    private mapElementTypeToName(elementType: ElementModels.ElementType): string | undefined {
        let result: string | undefined;
        if (elementType === 'text') {
            result = 'TextElement';
        } else if (elementType === 'number') {
            result = 'NumberElement';
        } else if (elementType === 'modular_content') {
            result = `LinkedItemsElement<IContentItem>`;
        } else if (elementType === 'asset') {
            result = 'AssetsElement';
        } else if (elementType === 'date_time') {
            result = 'DateTimeElement';
        } else if (elementType === 'rich_text') {
            result = 'RichTextElement';
        } else if (elementType === 'multiple_choice') {
            result = 'MultipleChoiceElement';
        } else if (elementType === 'url_slug') {
            result = 'UrlSlugElement';
        } else if (elementType === 'taxonomy') {
            result = 'TaxonomyElement';
        } else if (elementType === 'custom') {
            result = 'CustomElement';
        } else {
            result = undefined;
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
