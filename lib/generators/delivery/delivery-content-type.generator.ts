import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper, IGenerateResult } from '../../common-helper';
import { format, Options } from 'prettier';
import {
    ContentTypeResolver,
    ElementResolver,
    ContentTypeFileNameResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from '../../models';
import { ContentTypeElements, ContentTypeModels, TaxonomyModels } from '@kentico/kontent-management';
import {
    MapContentTypeToDeliveryTypeName,
    MapContentTypeIdToObject,
    MapContentTypeToFileName,
    MapElementToName,
    getMapContentTypeToDeliveryTypeName,
    getMapContentTypeIdToObject,
    getMapContentTypeToFileName,
    getMapElementToName,
    MapTaxonomyToFileName,
    MapTaxonomyName,
    getMapTaxonomyName,
    getMapTaxonomyToFileName,
    MapTaxonomyIdTobject,
    getMapTaxonomyIdTobject
} from './delivery-mappers';

export class DeliveryContentTypeGenerator {
    private readonly deliveryNpmPackageName: string = '@kentico/kontent-delivery';

    async generateModelsAsync(config: {
        typeFolderPath: string;
        taxonomyFolderPath: string;
        types: ContentTypeModels.ContentType[];
        taxonomies: TaxonomyModels.Taxonomy[];
        addTimestamp: boolean;
        elementResolver?: ElementResolver;
        contentTypeFileNameResolver?: ContentTypeFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
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

        if (config.contentTypeFileNameResolver) {
            console.log(
                `Using '${yellow(
                    config.contentTypeFileNameResolver instanceof Function
                        ? 'custom'
                        : config.contentTypeFileNameResolver
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

        if (config.contentTypeFileNameResolver || config.elementResolver || config.contentTypeResolver) {
            console.log('\n');
        }

        for (const type of config.types) {
            const filename = this.generateModels({
                type: type,
                typeFolderPath: config.typeFolderPath,
                taxonomyFolderPath: config.taxonomyFolderPath,
                contentTypeNameMap: getMapContentTypeToDeliveryTypeName(config.contentTypeResolver),
                contentTypeObjectMap: getMapContentTypeIdToObject(config.types),
                contentTypeFileNameMap: getMapContentTypeToFileName(config.contentTypeFileNameResolver),
                elementNameMap: getMapElementToName(config.elementResolver),
                taxonomyNameMap: getMapTaxonomyName(config.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(config.taxonomyFileResolver),
                taxonomyObjectMap: getMapTaxonomyIdTobject(config.taxonomies),
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions
            });
            filenames.push(filename);
        }

        return {
            filenames: filenames
        };
    }

    private getContentTypeImports(config: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        type: ContentTypeModels.ContentType;
        typeFolderPath: string;
        taxonomyFolderPath: string;
    }): string[] {
        const imports: string[] = [];
        const processedTypeIds: string[] = [];
        const processedTaxonomyIds: string[] = [];

        for (const element of config.type.elements) {
            if (element.type === 'taxonomy') {
                const taxonomy = this.extractUsedTaxonomy(element, config.taxonomyObjectMap);

                if (!taxonomy) {
                    continue;
                }

                if (processedTaxonomyIds.includes(taxonomy.id)) {
                    continue;
                }

                processedTaxonomyIds.push(taxonomy.id);

                const taxonomyName: string = config.taxonomyNameMap(taxonomy);
                const fileName: string = `../${config.taxonomyFolderPath}${config.taxonomyFileNameMap(
                    taxonomy,
                    false
                )}`;

                imports.push(`import { ${taxonomyName} } from '${fileName}';`);
            } else if (element.type === 'modular_content') {
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
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        type: ContentTypeModels.ContentType;
        typeFolderPath: string;
        taxonomyFolderPath: string;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        let code = `import { IContentItem, Elements } from '${this.deliveryNpmPackageName}';`;

        const contentTypeImports: string[] = this.getContentTypeImports({
            contentTypeNameMap: config.contentTypeNameMap,
            contentTypeObjectMap: config.contentTypeObjectMap,
            contentTypeFileNameMap: config.contentTypeFileNameMap,
            taxonomyFileNameMap: config.taxonomyFileNameMap,
            taxonomyNameMap: config.taxonomyNameMap,
            taxonomyObjectMap: config.taxonomyObjectMap,
            type: config.type,
            typeFolderPath: config.typeFolderPath,
            taxonomyFolderPath: config.taxonomyFolderPath
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
        elementNameMap: config.elementNameMap,
        taxonomyNameMap: config.taxonomyNameMap,
        taxonomyObjectMap: config.taxonomyObjectMap
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
        typeFolderPath: string;
        taxonomyFolderPath: string;
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const filename: string = `./${data.typeFolderPath}${data.contentTypeFileNameMap(data.type, true)}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            type: data.type,
            typeFolderPath: data.typeFolderPath,
            taxonomyFolderPath: data.taxonomyFolderPath,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            elementNameMap: data.elementNameMap,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });

        fs.writeFileSync(filename, code);
        console.log(`Created '${yellow(filename)}'`);
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
        contentTypeObjectMap: MapContentTypeIdToObject;
        elementNameMap: MapElementToName;
        type: ContentTypeModels.ContentType;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
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
                data.contentTypeObjectMap,
                data.taxonomyObjectMap,
                data.taxonomyNameMap
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
        contentTypeObjectMap: MapContentTypeIdToObject,
        taxonomyObjectMap: MapTaxonomyIdTobject,
        taxonomyNameMap: MapTaxonomyName
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
            const taxonomyName = this.getTaxonomyTypeName(element, taxonomyNameMap, taxonomyObjectMap);

            if (taxonomyName) {
                result = `TaxonomyElement<${taxonomyName}>`;
            } else {
                result = `TaxonomyElement`;
            }
        } else if (elementType === 'custom') {
            result = 'CustomElement';
        } else {
            result = undefined;
        }
        return result;
    }

    private getTaxonomyTypeName(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomyNameMap: MapTaxonomyName,
        taxonomyObjectMap: MapTaxonomyIdTobject
    ): string | undefined {
        const taxonomy = this.extractUsedTaxonomy(element, taxonomyObjectMap);

        if (!taxonomy) {
            return undefined;
        }

        return taxonomyNameMap(taxonomy);
    }

    private getLinkedItemsAllowedTypes(
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeNameMap: MapContentTypeToDeliveryTypeName,
        contentTypeObjectMap: MapContentTypeIdToObject
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
        contentTypeObjectMap: MapContentTypeIdToObject
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

    private extractUsedTaxonomy(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomyObjectMap: MapTaxonomyIdTobject
    ): TaxonomyModels.Taxonomy | undefined {
        if (element.type !== 'taxonomy') {
            throw Error(`Expected 'taxonomy' but got '${element.type}' for element '${element.codename}'`);
        }

        const taxonomyElement: ContentTypeElements.ITaxonomyElement = element;

        const taxonomyGroupId = taxonomyElement.taxonomy_group.id;
        if (!taxonomyGroupId) {
            throw Error(`Invalid taxonomy group id for taxonomy element '${element.id}'`);
        }

        return taxonomyObjectMap(taxonomyGroupId);
    }
}

export const deliveryContentTypeGenerator = new DeliveryContentTypeGenerator();
