import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper, IGenerateResult } from '../../common-helper';
import { textHelper } from '../../text-helper';
import { nameHelper } from '../../name-helper';
import { format, Options } from 'prettier';
import { ContentTypeResolver, ElementResolver, ContentTypeFileNameResolver } from '../../models';
import { ContentTypeElements, ContentTypeModels } from '@kentico/kontent-management';

type MapContentTypeToDeliveryTypeName = (contentType: ContentTypeModels.ContentType) => string;
type MapContentTypeIdToContentTypeObject = (id: string) => ContentTypeModels.ContentType;
type MapContentTypeToFileName = (contentType: ContentTypeModels.ContentType, addExtension: boolean) => string;
type MapElementToName = (
    element: ContentTypeElements.ContentTypeElementModel,
    contentType: ContentTypeModels.ContentType
) => string | undefined;

export class DeliveryContentTypeGenerator {
    private readonly deliveryNpmPackageName: string = '@kentico/kontent-delivery';

    async generateModelsAsync(config: {
        types: ContentTypeModels.ContentType[];
        addTimestamp: boolean;
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

        const contentTypeNameMap: MapContentTypeToDeliveryTypeName = (contentType) => {
            return nameHelper.getDeliveryContentTypeName({
                type: contentType,
                contentTypeResolver: config.contentTypeResolver
            });
        };

        const contentTypeObjectMap: MapContentTypeIdToContentTypeObject = (id) => {
            const allowedType = config.types.find((m) => m.id === id);

            if (!allowedType) {
                throw Error(`Could not find content type with id '${id}'`);
            }

            return allowedType;
        };

        const contentTypeFileNameMap: MapContentTypeToFileName = (contentType, addExtension) => {
            return nameHelper.getDeliveryContentTypeFilename({
                type: contentType,
                addExtension: addExtension,
                fileResolver: config.fileResolver
            });
        };

        for (const type of config.types) {
            const filename = this.generateModels({
                type: type,
                contentTypeNameMap: contentTypeNameMap,
                contentTypeObjectMap: contentTypeObjectMap,
                contentTypeFileNameMap: contentTypeFileNameMap,
                elementNameMap: (element, contentType) => {
                    if (!element.codename) {
                        return undefined;
                    }
                    const elementName = this.getElementName({
                        elementCodename: element.codename,
                        type: contentType.codename,
                        elementResolver: config.elementResolver
                    });

                    return elementName;
                },
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions
            });
            filenames.push(filename);
            console.log(`${yellow(contentTypeFileNameMap(type, true))} (${type.name})`);
        }

        return {
            filenames: filenames
        };
    }

    private getContentTypeImports(config: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        type: ContentTypeModels.ContentType;
    }): string[] {
        const imports: string[] = [];
        const processedTypeIds: string[] = [];

        for (const element of config.type.elements) {
            if (element.type === 'modular_content') {
                // extract referenced types
                const referencedTypes = this.extractLinkedItemsAllowedTypes(element, config.contentTypeObjectMap);

                for (const referencedType of referencedTypes) {
                    if (processedTypeIds.includes(referencedType.id)) {
                        // type was already processed, no need to import it multiple times
                        continue;
                    }

                    // filter 'self referencing' types as they don't need to be imported
                    if (config.type.id === referencedType.id) {
                        continue;
                    }

                    processedTypeIds.push(referencedType.id);

                    const typeName: string = config.contentTypeNameMap(referencedType);
                    const fileName: string = `./${config.contentTypeFileNameMap(referencedType, false)}`;

                    imports.push(`import { ${typeName} } from '${fileName}';`);
                }
            }
        }

        return imports;
    }

    private getModelCode(config: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        type: ContentTypeModels.ContentType;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        let code = `import { IContentItem, Elements } from '${this.deliveryNpmPackageName}';`;

        const contentTypeImports: string[] = this.getContentTypeImports({
            contentTypeNameMap: config.contentTypeNameMap,
            contentTypeObjectMap: config.contentTypeObjectMap,
            contentTypeFileNameMap: config.contentTypeFileNameMap,
            type: config.type
        });

        if (contentTypeImports.length) {
            for (const importItem of contentTypeImports) {
                code += `${importItem}`;
            }

            code += `\n`;
        }

        code += `
/**
* ${commonHelper.getAutogenerateNote(config.addTimestamp)}
* 
* ${this.getContentTypeComment(config.type)}
*/
export type ${config.contentTypeNameMap(config.type)} = IContentItem<{
    ${this.getElementsCode({
        contentTypeObjectMap: config.contentTypeObjectMap,
        contentTypeNameMap: config.contentTypeNameMap,
        type: config.type,
        elementNameMap: config.elementNameMap
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
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const filename: string = `./${data.contentTypeFileNameMap(data.type, true)}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            type: data.type,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            elementNameMap: data.elementNameMap
        });

        fs.writeFileSync(filename, code);
        return filename;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `${contentType.name}`;

        comment += `\n* Id: ${contentType.id}`;
        comment += `\n* Codename: ${contentType.codename}`;

        return comment;
    }

    private getElementComment(element: ContentTypeElements.ContentTypeElementModel): string {
        const isRequired = commonHelper.isElementRequired(element);
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element);

        let comment: string = '/**';

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        comment += `\n* Required: ${isRequired ? 'true' : 'false'}`;
        comment += `\n* Id: ${element.id}`;

        if (name) {
            comment += `\n* Codename: ${element.codename}`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${guidelines}`;
        }

        comment += '\n*/';

        return comment;
    }

    private getElementsCode(data: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject;
        elementNameMap: MapElementToName;
        type: ContentTypeModels.ContentType;
    }): string {
        let code = '';
        for (let i = 0; i < data.type.elements.length; i++) {
            const element = data.type.elements[i];
            if (!element.codename) {
                throw Error(`Invalid codename for element '${element.id}' in type '${data.type.codename}'`);
            }

            const elementName = data.elementNameMap(element, data.type);

            if (!elementName) {
                // skip element if its not resolver
                continue;
            }

            code += `${this.getElementComment(element)}\n`;
            code += `${elementName}: Elements.${this.mapElementType(
                element,
                data.contentTypeNameMap,
                data.contentTypeObjectMap
            )};`;

            if (i !== data.type.elements.length - 1) {
                code += '\n\n';
            }
        }

        return code;
    }

    private mapElementType(
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeNameMap: MapContentTypeToDeliveryTypeName,
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject
    ): string | undefined {
        const elementType = element.type;
        let result: string | undefined;

        if (elementType === 'text') {
            result = 'TextElement';
        } else if (elementType === 'number') {
            result = 'NumberElement';
        } else if (elementType === 'modular_content') {
            result = `LinkedItemsElement<${this.getLinkedItemsAllowedTypes(
                element,
                contentTypeNameMap,
                contentTypeObjectMap
            ).join(' | ')}>`;
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

    private getLinkedItemsAllowedTypes(
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeNameMap: MapContentTypeToDeliveryTypeName,
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject
    ): string[] {
        const allowedTypes = this.extractLinkedItemsAllowedTypes(element, contentTypeObjectMap);

        if (!allowedTypes.length) {
            return ['IContentItem'];
        }

        const allowedTypeNames: string[] = allowedTypes.map((m) => contentTypeNameMap(m)) ?? [];

        return allowedTypeNames;
    }

    private extractLinkedItemsAllowedTypes(
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeObjectMap: MapContentTypeIdToContentTypeObject
    ): ContentTypeModels.ContentType[] {
        if (element.type !== 'modular_content') {
            throw Error(`Expected 'modular_content' but got '${element.type}' for element '${element.codename}'`);
        }

        const linkedItemsElement: ContentTypeElements.ILinkedItemsElement = element;

        if (!linkedItemsElement.allowed_content_types?.length) {
            return [];
        }

        const allowedTypeIds: string[] = linkedItemsElement.allowed_content_types?.map((m) => m.id as string) ?? [];

        return allowedTypeIds.map((id) => contentTypeObjectMap(id));
    }

    private getElementName(config: {
        type: string;
        elementCodename: string;
        elementResolver?: ElementResolver;
    }): string {
        if (!config.elementResolver) {
            return config.elementCodename;
        }

        if (config.elementResolver instanceof Function) {
            return config.elementResolver(config.type, config.elementCodename);
        }

        return textHelper.resolveTextWithDefaultResolver(config.elementCodename, config.elementResolver);
    }
}

export const deliveryContentTypeGenerator = new DeliveryContentTypeGenerator();
