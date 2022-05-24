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
import {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    ElementModels,
    TaxonomyModels
} from '@kentico/kontent-management';
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
import { textHelper } from '../../text-helper';

interface IExtendedContentTypeElement {
    type: ElementModels.ElementType;
    element: ContentTypeElements.ContentTypeElementModel;
    mappedType: string | undefined;
    snippet?: ContentTypeSnippetModels.ContentTypeSnippet;
}

export class DeliveryContentTypeGenerator {
    private readonly deliveryNpmPackageName: string = '@kentico/kontent-delivery';

    async generateModelsAsync(data: {
        typeFolderPath: string;
        taxonomyFolderPath: string;
        types: ContentTypeModels.ContentType[];
        taxonomies: TaxonomyModels.Taxonomy[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        addTimestamp: boolean;
        elementResolver?: ElementResolver;
        contentTypeFileNameResolver?: ContentTypeFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
        formatOptions?: Options;
    }): Promise<IGenerateResult> {
        const filenames: string[] = [];

        if (data.elementResolver) {
            console.log(
                `Using '${yellow(
                    data.elementResolver instanceof Function ? 'custom' : data.elementResolver
                )}' name resolver for content type elements`
            );
        }

        if (data.contentTypeFileNameResolver) {
            console.log(
                `Using '${yellow(
                    data.contentTypeFileNameResolver instanceof Function ? 'custom' : data.contentTypeFileNameResolver
                )}' name resolver for content type filename`
            );
        }

        if (data.contentTypeResolver) {
            console.log(
                `Using '${yellow(
                    data.contentTypeResolver instanceof Function ? 'custom' : data.contentTypeResolver
                )}' name resolver for content types`
            );
        }

        if (data.contentTypeFileNameResolver || data.elementResolver || data.contentTypeResolver) {
            console.log('\n');
        }

        for (const type of data.types) {
            const filename = this.generateModels({
                type: type,
                snippets: data.snippets,
                taxonomies: data.taxonomies,
                typeFolderPath: data.typeFolderPath,
                taxonomyFolderPath: data.taxonomyFolderPath,
                contentTypeNameMap: getMapContentTypeToDeliveryTypeName(data.contentTypeResolver),
                contentTypeObjectMap: getMapContentTypeIdToObject(data.types),
                contentTypeFileNameMap: getMapContentTypeToFileName(data.contentTypeFileNameResolver),
                elementNameMap: getMapElementToName(data.elementResolver),
                taxonomyNameMap: getMapTaxonomyName(data.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(data.taxonomyFileResolver),
                taxonomyObjectMap: getMapTaxonomyIdTobject(data.taxonomies),
                addTimestamp: data.addTimestamp,
                formatOptions: data.formatOptions
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

    private getModelCode(data: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        type: ContentTypeModels.ContentType;
        taxonomies: TaxonomyModels.Taxonomy[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        typeFolderPath: string;
        taxonomyFolderPath: string;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        let code = `import { IContentItem, Elements } from '${this.deliveryNpmPackageName}';`;

        const contentTypeImports: string[] = this.getContentTypeImports({
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            type: data.type,
            typeFolderPath: data.typeFolderPath,
            taxonomyFolderPath: data.taxonomyFolderPath
        });

        if (contentTypeImports.length) {
            for (const importItem of contentTypeImports) {
                code += `${importItem}`;
            }

            code += `\n`;
        }

        code += `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${this.getContentTypeComment(data.type)}
*/
export type ${data.contentTypeNameMap(data.type)} = IContentItem<{
    ${this.getElementsCode({
        contentTypeObjectMap: data.contentTypeObjectMap,
        contentTypeNameMap: data.contentTypeNameMap,
        type: data.type,
        snippets: data.snippets,
        elementNameMap: data.elementNameMap,
        taxonomyNameMap: data.taxonomyNameMap,
        taxonomyObjectMap: data.taxonomyObjectMap,
        taxonomies: data.taxonomies
    })}
}>;
`;
        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
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
        taxonomies: TaxonomyModels.Taxonomy[];
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const filename: string = `./${data.typeFolderPath}${data.contentTypeFileNameMap(data.type, true)}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            type: data.type,
            snippets: data.snippets,
            taxonomies: data.taxonomies,
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

    private getElementComment(
        extendedElement: IExtendedContentTypeElement,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        const element = extendedElement.element;
        const isRequired = commonHelper.isElementRequired(element);
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);

        let comment: string = '/**';

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        comment += `\n* Required: ${isRequired ? 'true' : 'false'}`;
        comment += `\n* Id: ${element.id}`;

        if (name) {
            comment += `\n* Codename: ${element.codename}`;
        }

        if (extendedElement.snippet) {
            comment += `\n* From snippet: ${extendedElement.snippet.name}`;
            comment += `\n* Snippet codename: ${extendedElement.snippet.codename}`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }

        comment += '\n*/';

        return comment;
    }

    private getElementsCode(data: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        elementNameMap: MapElementToName;
        type: ContentTypeModels.ContentType;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomies: TaxonomyModels.Taxonomy[];
    }): string {
        const extendedElements: IExtendedContentTypeElement[] = this.getExtendedElements({
            contentType: data.type,
            snippets: data.snippets,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });

        let code = '';
        for (let i = 0; i < extendedElements.length; i++) {
            const extendedElement = extendedElements[i];
            const element = extendedElement.element;
            if (!element.codename) {
                throw Error(`Invalid codename for element '${element.id}' in type '${data.type.codename}'`);
            }

            const elementName = data.elementNameMap(element, data.type);

            if (!elementName) {
                // skip element if its not resolver
                continue;
            }

            if (!extendedElement.mappedType) {
                // element type not supported
                continue;
            }

            code += `${this.getElementComment(extendedElement, data.taxonomies)}\n`;
            code += `${elementName}: Elements.${extendedElement.mappedType};`;

            if (i !== data.type.elements.length - 1) {
                code += '\n\n';
            }
        }

        return code;
    }

    private mapElementType(data: {
        snippet?: ContentTypeSnippetModels.ContentTypeSnippet;
        element: ContentTypeElements.ContentTypeElementModel;
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
    }): IExtendedContentTypeElement {
        const elementType = data.element.type;
        let mappedType: string | undefined;

        if (elementType === 'text') {
            mappedType = 'TextElement';
        } else if (elementType === 'number') {
            mappedType = 'NumberElement';
        } else if (elementType === 'modular_content') {
            mappedType = `LinkedItemsElement<${this.getLinkedItemsAllowedTypes(
                data.element,
                data.contentTypeNameMap,
                data.contentTypeObjectMap
            ).join(' | ')}>`;
        } else if (elementType === 'asset') {
            mappedType = 'AssetsElement';
        } else if (elementType === 'date_time') {
            mappedType = 'DateTimeElement';
        } else if (elementType === 'rich_text') {
            mappedType = 'RichTextElement';
        } else if (elementType === 'multiple_choice') {
            mappedType = 'MultipleChoiceElement';
        } else if (elementType === 'url_slug') {
            mappedType = 'UrlSlugElement';
        } else if (elementType === 'taxonomy') {
            const taxonomyName = this.getTaxonomyTypeName(data.element, data.taxonomyNameMap, data.taxonomyObjectMap);

            if (taxonomyName) {
                mappedType = `TaxonomyElement<${taxonomyName}>`;
            } else {
                mappedType = `TaxonomyElement`;
            }
        } else if (elementType === 'custom') {
            mappedType = 'CustomElement';
        } else if (elementType === 'snippet') {
            mappedType = undefined;
        } else {
            mappedType = undefined;
        }
        return {
            mappedType: mappedType,
            type: elementType,
            snippet: data.snippet,
            element: data.element
        };
    }

    private getExtendedElements(data: {
        contentType: ContentTypeModels.ContentType;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
    }): IExtendedContentTypeElement[] {
        const extendedElements: IExtendedContentTypeElement[] = [];

        for (const element of data.contentType.elements) {
            if (element.type === 'snippet') {
                // get snippet elements
                const snippetElement: ContentTypeElements.ISnippetElement = element;
                const snippet = data.snippets.find((m) => m.id === snippetElement.snippet.id);

                if (!snippet) {
                    throw Error(
                        `Could not find content type snippet with id '${snippetElement.snippet.id}'. This snippet is used in type '${data.contentType.codename}'`
                    );
                }
                extendedElements.push(
                    ...snippet.elements.map((snippetElement) =>
                        this.mapElementType({
                            element: snippetElement,
                            contentTypeNameMap: data.contentTypeNameMap,
                            contentTypeObjectMap: data.contentTypeObjectMap,
                            taxonomyNameMap: data.taxonomyNameMap,
                            taxonomyObjectMap: data.taxonomyObjectMap,
                            snippet: snippet
                        })
                    )
                );
            } else {
                extendedElements.push(
                    this.mapElementType({
                        element: element,
                        contentTypeNameMap: data.contentTypeNameMap,
                        contentTypeObjectMap: data.contentTypeObjectMap,
                        taxonomyNameMap: data.taxonomyNameMap,
                        taxonomyObjectMap: data.taxonomyObjectMap,
                        snippet: undefined
                    })
                );
            }
        }

        return extendedElements;
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
