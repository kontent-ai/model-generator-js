import * as fs from 'fs';
import { yellow } from 'colors';
import { commonHelper, IGenerateContentTypesResult } from '../../common-helper';
import { format, Options } from 'prettier';
import {
    ContentTypeResolver,
    ElementResolver,
    ContentTypeFileNameResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver,
    ContentTypeSnippetResolver,
    ContentTypeSnippetFileNameResolver
} from '../../models';
import {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    ElementModels,
    TaxonomyModels
} from '@kontent-ai/management-sdk';
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
    getMapTaxonomyIdTobject,
    MapContentTypeSnippetToFileName,
    MapContentTypeSnippetToDeliveryTypeName,
    getMapContentTypeSnippetToDeliveryTypeName,
    getMapContentTypeSnippetToFileName,
    MapContentTypeSnippetIdToObject,
    getMapContentTypeSnippetIdToObject
} from './delivery-mappers';
import { textHelper } from '../../text-helper';

interface IExtendedContentTypeElement {
    type: ElementModels.ElementType;
    element: ContentTypeElements.ContentTypeElementModel;
    mappedType: string | undefined;
    snippet?: ContentTypeSnippetModels.ContentTypeSnippet;
}

interface IExtractImportsResult {
    imports: string[];
    contentTypeSnippetExtensions: string[];
}

export class DeliveryContentTypeGenerator {
    private readonly deliveryNpmPackageName: string = '@kontent-ai/delivery-sdk';

    async generateModelsAsync(data: {
        typeFolderPath: string;
        typeSnippetsFolderPath: string;
        taxonomyFolderPath: string;
        types: ContentTypeModels.ContentType[];
        taxonomies: TaxonomyModels.Taxonomy[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        addTimestamp: boolean;
        elementResolver?: ElementResolver;
        contentTypeFileNameResolver?: ContentTypeFileNameResolver;
        contentTypeSnippetFileNameResolver?: ContentTypeSnippetFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        contentTypeSnippetResolver?: ContentTypeSnippetResolver;
        taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
        formatOptions?: Options;
    }): Promise<IGenerateContentTypesResult> {
        const contentTypeFilenames: string[] = [];
        const contentTypeSnippetFilenames: string[] = [];

        let addNewLineAfterResolvers: boolean = false;

        if (data.elementResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${yellow(
                    data.elementResolver instanceof Function ? 'custom' : data.elementResolver
                )}' name resolver for content type elements`
            );
        }

        if (data.contentTypeFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${yellow(
                    data.contentTypeFileNameResolver instanceof Function ? 'custom' : data.contentTypeFileNameResolver
                )}' name resolver for content type filenames`
            );
        }

        if (data.contentTypeSnippetFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${yellow(
                    data.contentTypeSnippetFileNameResolver instanceof Function
                        ? 'custom'
                        : data.contentTypeSnippetFileNameResolver
                )}' name resolver for content type snippet filenames`
            );
        }

        if (data.contentTypeResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${yellow(
                    data.contentTypeResolver instanceof Function ? 'custom' : data.contentTypeResolver
                )}' name resolver for content types`
            );
        }

        if (data.contentTypeSnippetResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${yellow(
                    data.contentTypeSnippetResolver instanceof Function ? 'custom' : data.contentTypeSnippetResolver
                )}' name resolver for content type snippets`
            );
        }

        if (addNewLineAfterResolvers) {
            console.log('');
        }

        for (const contentTypeSnippet of data.snippets) {
            const filename = this.createContentTypeSnippetModel({
                snippet: contentTypeSnippet,
                snippets: data.snippets,
                taxonomies: data.taxonomies,
                typeFolderPath: data.typeFolderPath,
                typeSnippetsFolderPath: data.typeSnippetsFolderPath,
                taxonomyFolderPath: data.taxonomyFolderPath,
                contentTypeSnippetNameMap: getMapContentTypeSnippetToDeliveryTypeName(data.contentTypeSnippetResolver),
                contentTypeSnippetFileNameMap: getMapContentTypeSnippetToFileName(
                    data.contentTypeSnippetFileNameResolver
                ),
                contentTypeNameMap: getMapContentTypeToDeliveryTypeName(data.contentTypeResolver),
                contentTypeObjectMap: getMapContentTypeIdToObject(data.types),
                contentTypeSnippetObjectMap: getMapContentTypeSnippetIdToObject(data.snippets),
                contentTypeFileNameMap: getMapContentTypeToFileName(data.contentTypeFileNameResolver),
                elementNameMap: getMapElementToName(data.elementResolver),
                taxonomyNameMap: getMapTaxonomyName(data.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(data.taxonomyFileResolver),
                taxonomyObjectMap: getMapTaxonomyIdTobject(data.taxonomies),
                addTimestamp: data.addTimestamp,
                formatOptions: data.formatOptions
            });
            contentTypeSnippetFilenames.push(filename);
        }

        for (const type of data.types) {
            const filename = this.createContentTypeModel({
                type: type,
                snippets: data.snippets,
                taxonomies: data.taxonomies,
                typeFolderPath: data.typeFolderPath,
                typeSnippetsFolderPath: data.typeSnippetsFolderPath,
                taxonomyFolderPath: data.taxonomyFolderPath,
                contentTypeSnippetNameMap: getMapContentTypeSnippetToDeliveryTypeName(data.contentTypeSnippetResolver),
                contentTypeSnippetFileNameMap: getMapContentTypeSnippetToFileName(
                    data.contentTypeSnippetFileNameResolver
                ),
                contentTypeNameMap: getMapContentTypeToDeliveryTypeName(data.contentTypeResolver),
                contentTypeObjectMap: getMapContentTypeIdToObject(data.types),
                contentTypeFileNameMap: getMapContentTypeToFileName(data.contentTypeFileNameResolver),
                contentTypeSnippetObjectMap: getMapContentTypeSnippetIdToObject(data.snippets),
                elementNameMap: getMapElementToName(data.elementResolver),
                taxonomyNameMap: getMapTaxonomyName(data.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(data.taxonomyFileResolver),
                taxonomyObjectMap: getMapTaxonomyIdTobject(data.taxonomies),
                addTimestamp: data.addTimestamp,
                formatOptions: data.formatOptions
            });
            contentTypeFilenames.push(filename);
        }

        return {
            contentTypeFilenames: contentTypeFilenames,
            contentTypeSnippetFilenames: contentTypeSnippetFilenames
        };
    }

    private getContentTypeImports(data: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeSnippetNameMap: MapContentTypeSnippetToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        contentTypeSnippetFileNameMap: MapContentTypeSnippetToFileName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        contentType?: ContentTypeModels.ContentType;
        contentTypeSnippet?: ContentTypeSnippetModels.ContentTypeSnippet;
        typeFolderPath: string;
        typeSnippetsFolderPath: string;
        taxonomyFolderPath: string;
    }): IExtractImportsResult {
        const imports: string[] = [];
        const contentTypeSnippetExtensions: string[] = [];
        const processedTypeIds: string[] = [];
        const processedTaxonomyIds: string[] = [];

        const extendedElements: IExtendedContentTypeElement[] = this.getExtendedElements({
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });

        for (const extendedElement of extendedElements) {
            const element = extendedElement.element;

            if (element.type === 'taxonomy') {
                const taxonomy = this.extractUsedTaxonomy(element, data.taxonomyObjectMap);

                if (!taxonomy) {
                    continue;
                }

                if (processedTaxonomyIds.includes(taxonomy.id)) {
                    continue;
                }

                processedTaxonomyIds.push(taxonomy.id);

                const taxonomyName: string = data.taxonomyNameMap(taxonomy);
                const fileName: string = `../${data.taxonomyFolderPath}${data.taxonomyFileNameMap(taxonomy, false)}`;

                imports.push(`import { ${taxonomyName} } from '${fileName}';`);
            } else if (element.type === 'modular_content' || element.type === 'subpages') {
                // extract referenced types
                const referencedTypes = this.extractLinkedItemsAllowedTypes(element, data.contentTypeObjectMap);

                for (const referencedType of referencedTypes) {
                    if (processedTypeIds.includes(referencedType.id)) {
                        // type was already processed, no need to import it multiple times
                        continue;
                    }

                    // filter 'self referencing' types as they don't need to be imported
                    if (data.contentType?.id === referencedType.id) {
                        continue;
                    }

                    processedTypeIds.push(referencedType.id);

                    const typeName: string = data.contentTypeNameMap(referencedType);
                    const fileName: string = `${data.contentTypeFileNameMap(referencedType, false)}`;

                    const filePath: string = data.contentTypeSnippet
                        ? `../${data.typeFolderPath}${fileName}`
                        : `./${fileName}`;

                    imports.push(`import { ${typeName} } from '${filePath}';`);
                }
            } else if (element.type === 'snippet') {
                const contentTypeSnipped = this.extractUsedSnippet(element, data.contentTypeSnippetObjectMap);

                const typeName: string = data.contentTypeSnippetNameMap(contentTypeSnipped);
                const filePath: string = `../${data.typeSnippetsFolderPath}${data.contentTypeSnippetFileNameMap(
                    contentTypeSnipped,
                    false
                )}`;

                imports.push(`import { ${typeName} } from '${filePath}';`);
                contentTypeSnippetExtensions.push(typeName);
            }
        }

        return {
            imports: imports,
            contentTypeSnippetExtensions: contentTypeSnippetExtensions
        };
    }

    private getModelCode(data: {
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeSnippetNameMap: MapContentTypeSnippetToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        contentTypeSnippetFileNameMap: MapContentTypeSnippetToFileName;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        contentType?: ContentTypeModels.ContentType;
        contentTypeSnippet?: ContentTypeSnippetModels.ContentTypeSnippet;
        taxonomies: TaxonomyModels.Taxonomy[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        typeFolderPath: string;
        typeSnippetsFolderPath: string;
        taxonomyFolderPath: string;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        let code = '';   
        
        const elementsCode = this.getElementsCode({
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            snippets: data.snippets,
            elementNameMap: data.elementNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            taxonomies: data.taxonomies
        })

        if(elementsCode) { code += `import { IContentItem, Elements } from '${this.deliveryNpmPackageName}';`; }

        const importResult = this.getContentTypeImports({
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            snippets: data.snippets,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            typeFolderPath: data.typeFolderPath,
            typeSnippetsFolderPath: data.typeSnippetsFolderPath,
            taxonomyFolderPath: data.taxonomyFolderPath
        });

        if (importResult.imports.length) {
            for (const importItem of importResult.imports) {
                code += `${importItem}`;
            }

            code += `\n`;
        }

        let comment: string = '';
        let typeName: string = '';
        let typeExtends: string = '';

        if (data.contentType) {
            comment = this.getContentTypeComment(data.contentType);
            typeName = data.contentTypeNameMap(data.contentType);

            if (importResult.contentTypeSnippetExtensions.length) {
                typeExtends = importResult.contentTypeSnippetExtensions.join(' & ');
            }
        } else if (data.contentTypeSnippet) {
            comment = this.getContentTypeSnippetComment(data.contentTypeSnippet);
            typeName = data.contentTypeSnippetNameMap(data.contentTypeSnippet);
        }

        let typeElements: string = '';
        if(elementsCode) {
            typeElements += `IContentItem<{
  ${elementsCode}
}>`
        }
        if(elementsCode && typeExtends) {
            typeElements += ' & '
        }
        if(typeExtends) {
            typeElements += typeExtends
        }

        if(!elementsCode && !typeExtends) { typeElements = '{}'}

        code += `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${comment}
*/
export type ${typeName} = ${typeElements};
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

    private createContentTypeModel(data: {
        type: ContentTypeModels.ContentType;
        typeFolderPath: string;
        typeSnippetsFolderPath: string;
        taxonomyFolderPath: string;
        taxonomies: TaxonomyModels.Taxonomy[];
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeSnippetNameMap: MapContentTypeSnippetToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeFileNameMap: MapContentTypeToFileName;
        contentTypeSnippetFileNameMap: MapContentTypeSnippetToFileName;
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject;
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
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            contentType: data.type,
            contentTypeSnippet: undefined,
            snippets: data.snippets,
            taxonomies: data.taxonomies,
            typeFolderPath: data.typeFolderPath,
            typeSnippetsFolderPath: data.typeSnippetsFolderPath,
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

    private createContentTypeSnippetModel(data: {
        snippet: ContentTypeSnippetModels.ContentTypeSnippet;
        typeSnippetsFolderPath: string;
        taxonomyFolderPath: string;
        typeFolderPath: string;
        taxonomies: TaxonomyModels.Taxonomy[];
        contentTypeSnippetNameMap: MapContentTypeSnippetToDeliveryTypeName;
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeFileNameMap: MapContentTypeToFileName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        contentTypeSnippetFileNameMap: MapContentTypeSnippetToFileName;
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject;
        elementNameMap: MapElementToName;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const filename: string = `./${data.typeSnippetsFolderPath}${data.contentTypeSnippetFileNameMap(
            data.snippet,
            true
        )}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            contentType: undefined,
            contentTypeSnippet: data.snippet,
            snippets: data.snippets,
            taxonomies: data.taxonomies,
            typeFolderPath: data.typeFolderPath,
            typeSnippetsFolderPath: data.typeSnippetsFolderPath,
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

    private getContentTypeSnippetComment(contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet): string {
        let comment: string = `${contentTypeSnippet.name}`;

        comment += `\n* Id: ${contentTypeSnippet.id}`;
        comment += `\n* Codename: ${contentTypeSnippet.codename}`;

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
        const codename = commonHelper.getElementCodename(element);

        let comment: string = '/**';

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        comment += `\n* Required: ${isRequired ? 'true' : 'false'}`;
        comment += `\n* Id: ${element.id}`;

        if (codename) {
            comment += `\n* Codename: ${codename}`;
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
        contentType?: ContentTypeModels.ContentType;
        contentTypeSnippet?: ContentTypeSnippetModels.ContentTypeSnippet;
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
        taxonomies: TaxonomyModels.Taxonomy[];
    }): string {
        const extendedElements: IExtendedContentTypeElement[] = this.getExtendedElements({
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });

        let code = '';
        for (let i = 0; i < extendedElements.length; i++) {
            const extendedElement = extendedElements[i];
            const element = extendedElement.element;

            const codename = commonHelper.getElementCodename(element);

            if (!codename) {
                throw Error(`Invalid codename for element '${element.id}'`);
            }

            const elementName = data.elementNameMap(element);

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

            if (i !== extendedElements.length - 1) {
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
        } else if (elementType === 'modular_content' || elementType === 'subpages') {
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
        contentType?: ContentTypeModels.ContentType;
        contentTypeSnippet?: ContentTypeSnippetModels.ContentTypeSnippet;
        contentTypeNameMap: MapContentTypeToDeliveryTypeName;
        contentTypeObjectMap: MapContentTypeIdToObject;
        taxonomyObjectMap: MapTaxonomyIdTobject;
        taxonomyNameMap: MapTaxonomyName;
    }): IExtendedContentTypeElement[] {
        const extendedElements: IExtendedContentTypeElement[] = [];

        const elements = data.contentType ? data.contentType.elements : data.contentTypeSnippet?.elements ?? [];

        for (const element of elements) {
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
        const allowedTypeIds: string[] = [];

        const codename = commonHelper.getElementCodename(element);

        if (element.type === 'modular_content') {
            const linkedItemsElement: ContentTypeElements.ILinkedItemsElement = element;

            if (linkedItemsElement?.allowed_content_types?.length) {
                allowedTypeIds.push(...(linkedItemsElement.allowed_content_types?.map((m) => m.id as string) ?? []));
            }
        } else if (element.type === 'subpages') {
            const subpagesItemsElement: ContentTypeElements.ISubpagesElement = element;

            if (subpagesItemsElement?.allowed_content_types?.length) {
                allowedTypeIds.push(...(subpagesItemsElement.allowed_content_types?.map((m) => m.id as string) ?? []));
            }
        } else {
            throw Error(
                `Expected 'modular_content' or 'subpages' but got '${element.type}' for element '${codename}' with id '${element.id}'`
            );
        }

        return allowedTypeIds.map((id) => contentTypeObjectMap(id));
    }

    private extractUsedSnippet(
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject
    ): ContentTypeSnippetModels.ContentTypeSnippet {
        if (element.type !== 'snippet') {
            throw Error(`Expected 'snippet' but got '${element.type}' for element '${element.codename}'`);
        }

        const snippetElement: ContentTypeElements.ISnippetElement = element;

        const snippedId = snippetElement.snippet.id;
        if (!snippedId) {
            throw Error(`Invalid snippet id for taxonomy element '${element.id}'`);
        }

        return contentTypeSnippetObjectMap(snippedId);
    }

    private extractUsedTaxonomy(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomyObjectMap: MapTaxonomyIdTobject
    ): TaxonomyModels.Taxonomy | undefined {
        const codename = commonHelper.getElementCodename(element);

        if (element.type !== 'taxonomy') {
            throw Error(
                `Expected 'taxonomy' but got '${element.type}' for element '${codename}' with id '${element.id}'`
            );
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
