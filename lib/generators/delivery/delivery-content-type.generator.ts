import chalk from 'chalk';
import { commonHelper } from '../../common-helper.js';
import {
    ContentTypeResolver,
    ElementResolver,
    ContentTypeFileNameResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver,
    ContentTypeSnippetResolver,
    ContentTypeSnippetFileNameResolver,
    ModuleResolution
} from '../../models.js';
import {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    ElementModels,
    EnvironmentModels,
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
} from './delivery-mappers.js';
import { commentsManager as _commentsManager } from '../../comments/index.js';
import { textHelper } from '../../text-helper.js';
import {
    deliveryConfig,
    FlattenedElement,
    GeneratedFile,
    getFlattenedElements,
    sortAlphabetically
} from '../../core/index.js';

// interface IExtendedContentTypeElement {
//     readonly type: ElementModels.ElementType;
//     readonly element: Readonly<ContentTypeElements.ContentTypeElementModel>;
//     readonly mappedType: string | undefined;
//     readonly mappedName: string | undefined;
//     readonly snippet?: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
// }

interface IExtractImportsResult {
    readonly imports: readonly string[];
    readonly contentTypeSnippetExtensions: string[];
    readonly processedElements: readonly FlattenedElement[];
}

export interface DeliveryContentTypeGeneratorConfig {
    readonly typeFolderName: string;
    readonly typeSnippetsFolderName: string;
    readonly taxonomyFolderName: string;

    readonly addTimestamp: boolean;
    readonly addEnvironmentInfo: boolean;
    readonly elementResolver?: ElementResolver;
    readonly contentTypeFileNameResolver?: ContentTypeFileNameResolver;
    readonly contentTypeSnippetFileNameResolver?: ContentTypeSnippetFileNameResolver;
    readonly contentTypeResolver?: ContentTypeResolver;
    readonly contentTypeSnippetResolver?: ContentTypeSnippetResolver;
    readonly taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
    readonly taxonomyResolver?: TaxonomyTypeResolver;
    readonly moduleResolution: ModuleResolution;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
        readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
    };
}

export function deliveryContentTypeGenerator(config: DeliveryContentTypeGeneratorConfig) {
    const commentsManager = _commentsManager(config.addTimestamp);

    // prepare resolvers
    const contentTypeSnippetNameMap = getMapContentTypeSnippetToDeliveryTypeName(config.contentTypeSnippetResolver);
    const contentTypeSnippetFileNameMap = getMapContentTypeSnippetToFileName(config.contentTypeSnippetFileNameResolver);
    const contentTypeNameMap = getMapContentTypeToDeliveryTypeName(config.contentTypeResolver);
    const contentTypeObjectMap = getMapContentTypeIdToObject(config.environmentData.types);
    const contentTypeSnippetObjectMap = getMapContentTypeSnippetIdToObject(config.environmentData.snippets);
    const contentTypeFileNameMap = getMapContentTypeToFileName(config.contentTypeFileNameResolver);
    const elementNameMap = getMapElementToName(config.elementResolver);
    const taxonomyNameMap = getMapTaxonomyName(config.taxonomyResolver);
    const taxonomyFileNameMap = getMapTaxonomyToFileName(config.taxonomyFileResolver);
    const taxonomyObjectMap = getMapTaxonomyIdTobject(config.environmentData.taxonomies);

    const generateModels = (): {
        contentTypeFiles: readonly GeneratedFile[];
        snippetFiles: readonly GeneratedFile[];
    } => {
        const typeFiles: GeneratedFile[] = [];
        const snippetFiles: GeneratedFile[] = [];

        let addNewLineAfterResolvers: boolean = false;

        if (config.elementResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${chalk.yellow(
                    config.elementResolver instanceof Function ? 'custom' : config.elementResolver
                )}' name resolver for content type elements`
            );
        }

        if (config.contentTypeFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${chalk.yellow(
                    config.contentTypeFileNameResolver instanceof Function
                        ? 'custom'
                        : config.contentTypeFileNameResolver
                )}' name resolver for content type filenames`
            );
        }

        if (config.contentTypeSnippetFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${chalk.yellow(
                    config.contentTypeSnippetFileNameResolver instanceof Function
                        ? 'custom'
                        : config.contentTypeSnippetFileNameResolver
                )}' name resolver for content type snippet filenames`
            );
        }

        if (config.contentTypeResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${chalk.yellow(
                    config.contentTypeResolver instanceof Function ? 'custom' : config.contentTypeResolver
                )}' name resolver for content types`
            );
        }

        if (config.contentTypeSnippetResolver) {
            addNewLineAfterResolvers = true;
            console.log(
                `Using '${chalk.yellow(
                    config.contentTypeSnippetResolver instanceof Function ? 'custom' : config.contentTypeSnippetResolver
                )}' name resolver for content type snippets`
            );
        }

        if (addNewLineAfterResolvers) {
            console.log('');
        }

        for (const contentTypeSnippet of config.environmentData.snippets) {
            try {
                const file = createContentTypeSnippetModel({
                    snippet: contentTypeSnippet
                });
                snippetFiles.push(file);
            } catch (error) {
                console.error(error);
                throw Error(
                    `Failed to process content type snippet '${contentTypeSnippet.codename}' (${contentTypeSnippet.name})`
                );
            }
        }

        for (const type of config.environmentData.types) {
            try {
                const file = createContentTypeModel({
                    type: type
                });
                typeFiles.push(file);
            } catch (error) {
                console.error(error);
                throw Error(`Failed to process content type '${type.codename}' (${type.name})`);
            }
        }

        return {
            contentTypeFiles: typeFiles,
            snippetFiles: snippetFiles
        };
    };

    const getContentTypeImports = (data: {
        typeOrSnippet: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet;
    }): IExtractImportsResult => {
        const imports: string[] = [];
        const contentTypeSnippetExtensions: string[] = [];
        const processedTypeIds: string[] = [];
        const processedTaxonomyIds: string[] = [];

        const flattenedElements = getFlattenedElements(
            data.typeOrSnippet.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        for (const extendedElement of flattenedElements) {
            const element = extendedElement.originalElement;

            if (element.type === 'taxonomy') {
                const taxonomy = extractUsedTaxonomy(element, taxonomyObjectMap);

                if (!taxonomy) {
                    continue;
                }

                if (processedTaxonomyIds.includes(taxonomy.id)) {
                    continue;
                }

                processedTaxonomyIds.push(taxonomy.id);

                const taxonomyName: string = taxonomyNameMap(taxonomy);
                const fileName: string = `../${config.taxonomyFolderName}/${taxonomyFileNameMap(taxonomy, false)}`;

                imports.push(
                    commonHelper.getImportStatement({
                        moduleResolution: config.moduleResolution,
                        filePathOrPackage: fileName,
                        importValue: `type ${taxonomyName}`,
                        isExternalLib: false
                    })
                );
            } else if (element.type === 'modular_content' || element.type === 'subpages') {
                // extract referenced types
                const referencedTypes = extractLinkedItemsAllowedTypes(element, contentTypeObjectMap);

                for (const referencedType of referencedTypes) {
                    if (processedTypeIds.includes(referencedType.id)) {
                        // type was already processed, no need to import it multiple times
                        continue;
                    }

                    // filter 'self referencing' types as they don't need to be imported
                    if (data.typeOrSnippet?.id === referencedType.id) {
                        continue;
                    }

                    processedTypeIds.push(referencedType.id);

                    const typeName: string = contentTypeNameMap(referencedType);
                    const fileName: string = `${contentTypeFileNameMap(referencedType, false)}`;

                    const filePath: string =
                        data.typeOrSnippet instanceof ContentTypeModels.ContentType
                            ? `../${config.typeFolderName}/${fileName}`
                            : `./${fileName}`;

                    imports.push(
                        commonHelper.getImportStatement({
                            moduleResolution: config.moduleResolution,
                            filePathOrPackage: filePath,
                            importValue: `type ${typeName}`,
                            isExternalLib: false
                        })
                    );
                }
            } else if (element.type === 'snippet') {
                const contentTypeSnipped = extractUsedSnippet(element, contentTypeSnippetObjectMap);

                const typeName: string = contentTypeSnippetNameMap(contentTypeSnipped);
                const filePath: string = `../${config.typeSnippetsFolderName}${contentTypeSnippetFileNameMap(
                    contentTypeSnipped,
                    false
                )}`;

                imports.push(
                    commonHelper.getImportStatement({
                        moduleResolution: config.moduleResolution,
                        filePathOrPackage: filePath,
                        importValue: `type ${typeName}`,
                        isExternalLib: false
                    })
                );

                contentTypeSnippetExtensions.push(typeName);
            }
        }

        return {
            imports: sortAlphabetically(imports, (item) => item),
            contentTypeSnippetExtensions: contentTypeSnippetExtensions,
            processedElements: flattenedElements
        };
    };

    const getModelCode = (data: {
        typeOrSnippet: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet;
    }): string => {
        const importResult = getContentTypeImports({
            typeOrSnippet: data.typeOrSnippet
        });

        const flattenedElements = getFlattenedElements(
            data.typeOrSnippet.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        const topLevelImports: string[] = ['type IContentItem'];

        if (importResult.processedElements.filter((m) => m.type !== 'snippet' && m.type !== 'guidelines').length) {
            // add 'Elements' import only if there is > 1 elements in content type
            topLevelImports.push('type Elements');
        }

        let code = commonHelper.getImportStatement({
            moduleResolution: config.moduleResolution,
            filePathOrPackage: deliveryConfig.npmPackageName,
            importValue: `${topLevelImports.join(', ')}`,
            isExternalLib: true
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

        if (data.typeOrSnippet instanceof ContentTypeModels.ContentType) {
            comment = getContentTypeComment(data.typeOrSnippet);
            typeName = contentTypeNameMap(data.typeOrSnippet);

            if (importResult.contentTypeSnippetExtensions.length) {
                typeExtends = `& ${importResult.contentTypeSnippetExtensions.join(' & ')}`;
            }
        } else if (data.typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet) {
            comment = getContentTypeSnippetComment(data.typeOrSnippet);
            typeName = contentTypeSnippetNameMap(data.typeOrSnippet);
        }

        code += `
${commentsManager.environmentInfo(config.environmentData.environment)}

/**
* 
* ${comment}
*/
export type ${typeName} = IContentItem<{
    ${getElementsCode({
        flattenedElements: flattenedElements
    })}
}>${typeExtends};
`;
        return code;
    };

    const createContentTypeModel = (data: { type: ContentTypeModels.ContentType }): GeneratedFile => {
        const filename: string = `${config.typeFolderName}/${contentTypeFileNameMap(data.type, true)}`;
        const code = getModelCode({
            typeOrSnippet: data.type
        });

        return {
            filename: filename,
            text: code
        };
    };

    const createContentTypeSnippetModel = (data: {
        readonly snippet: ContentTypeSnippetModels.ContentTypeSnippet;
    }): GeneratedFile => {
        const filename: string = `${config.typeSnippetsFolderName}/${contentTypeSnippetFileNameMap(
            data.snippet,
            true
        )}`;
        const code = getModelCode({
            typeOrSnippet: data.snippet
        });

        return {
            filename: filename,
            text: code
        };
    };

    const getContentTypeComment = (contentType: ContentTypeModels.ContentType): string => {
        let comment: string = `${contentType.name}`;

        comment += `\n* Id: ${contentType.id}`;
        comment += `\n* Codename: ${contentType.codename}`;

        return comment;
    };

    const getContentTypeSnippetComment = (contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet): string => {
        let comment: string = `${contentTypeSnippet.name}`;

        comment += `\n* Id: ${contentTypeSnippet.id}`;
        comment += `\n* Codename: ${contentTypeSnippet.codename}`;

        return comment;
    };

    const getElementComment = (
        flattenedElement: FlattenedElement,
        taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
    ): string => {
        const element = flattenedElement.originalElement;
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

        // if (flattenedElement.snippet) {
        //     comment += `\n* From snippet: ${flattenedElement.snippet.name}`;
        //     comment += `\n* Snippet codename: ${flattenedElement.snippet.codename}`;
        // }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }

        comment += '\n*/';

        return comment;
    };

    const getElementsCode = (data: { flattenedElements: readonly FlattenedElement[] }): string => {
        let code = '';
        for (let i = 0; i < data.flattenedElements.length; i++) {
            const flattenedElement = data.flattenedElements[i];
            const element = flattenedElement.originalElement;
            const mappedType = mapElementType({ element: flattenedElement });

            const codename = commonHelper.getElementCodename(element);

            if (!codename) {
                throw Error(`Invalid codename for element '${element.id}'`);
            }

            const elementName = elementNameMap(element);

            if (!elementName) {
                // skip element if its not resolver
                continue;
            }

            // if (!extendedElement.mappedType) {
            //     // element type not supported
            //     continue;
            // }

            code += `${getElementComment(flattenedElement, config.environmentData.taxonomies)}\n`;
            code += `${elementName}: Elements.${mappedType};`;

            if (i !== data.flattenedElements.length - 1) {
                code += '\n\n';
            }
        }

        return code;
    };

    const mapElementType = (data: { element: FlattenedElement }): string | undefined => {
        const elementType = data.element.type;
        let mappedType: string | undefined;

        if (elementType === 'text') {
            mappedType = 'TextElement';
        } else if (elementType === 'number') {
            mappedType = 'NumberElement';
        } else if (elementType === 'modular_content' || elementType === 'subpages') {
            mappedType = `LinkedItemsElement<${getLinkedItemsAllowedTypes(data.element.allowedContentTypes ?? []).join(' | ')}>`;
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
            const taxonomyName = getTaxonomyTypeName(data.element);

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
        return mappedType;
    };

    const getTaxonomyTypeName = (element: FlattenedElement): string | undefined => {
        return element.assignedTaxonomy ? taxonomyNameMap(element.assignedTaxonomy) : undefined;
    };

    const getLinkedItemsAllowedTypes = (types: readonly Readonly<ContentTypeModels.ContentType>[]): string[] => {
        if (!types.length) {
            return ['IContentItem'];
        }

        const allowedTypeNames: string[] = types.map((m) => contentTypeNameMap(m)) ?? [];

        return allowedTypeNames;
    };

    const extractLinkedItemsAllowedTypes = (
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeObjectMap: MapContentTypeIdToObject
    ): ContentTypeModels.ContentType[] => {
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
    };

    const extractUsedSnippet = (
        element: ContentTypeElements.ContentTypeElementModel,
        contentTypeSnippetObjectMap: MapContentTypeSnippetIdToObject
    ): ContentTypeSnippetModels.ContentTypeSnippet => {
        if (element.type !== 'snippet') {
            throw Error(`Expected 'snippet' but got '${element.type}' for element '${element.codename}'`);
        }

        const snippetElement: ContentTypeElements.ISnippetElement = element;

        const snippedId = snippetElement.snippet.id;
        if (!snippedId) {
            throw Error(`Invalid snippet id for taxonomy element '${element.id}'`);
        }

        return contentTypeSnippetObjectMap(snippedId);
    };

    const extractUsedTaxonomy = (
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomyObjectMap: MapTaxonomyIdTobject
    ): TaxonomyModels.Taxonomy | undefined => {
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
    };

    return {
        generateModels
    };
}
