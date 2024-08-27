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
    getImportStatement,
    sortAlphabetically,
    toSafeString,
    uniqueFilter
} from '../../core/index.js';
import { match, P } from 'ts-pattern';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';

// interface IExtendedContentTypeElement {
//     readonly type: ElementModels.ElementType;
//     readonly element: Readonly<ContentTypeElements.ContentTypeElementModel>;
//     readonly mappedType: string | undefined;
//     readonly mappedName: string | undefined;
//     readonly snippet?: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
// }

interface IExtractImportsResult {
    readonly typeName: string;
    readonly imports: readonly string[];
    readonly contentTypeExtends: string | undefined;
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

    const snippetImports = (
        snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]
    ): readonly string[] => {
        return snippets.map((snippet) => {
            return getImportStatement({
                moduleResolution: config.moduleResolution,
                filePathOrPackage: `../${config.typeSnippetsFolderName}/${contentTypeSnippetFileNameMap(
                    snippet,
                    false
                )}.ts`,
                importValue: contentTypeSnippetNameMap(snippet)
            });
        });
    };

    const getElementImports = (
        typeOrSnippet: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet,
        elements: readonly FlattenedElement[]
    ): readonly string[] => {
        return (
            elements
                // only take elements that are not from snippets
                .filter((m) => !m.fromSnippet)
                .map((flattenedElement) =>
                    match(flattenedElement)
                        .returnType<string | string[]>()
                        .with({ type: 'taxonomy' }, (taxonomyElement) => {
                            if (!taxonomyElement.assignedTaxonomy) {
                                throw Error(`Invalid taxonomy for element '${taxonomyElement.codename}'`);
                            }
                            return getImportStatement({
                                moduleResolution: config.moduleResolution,
                                filePathOrPackage: `../${config.taxonomyFolderName}/${taxonomyFileNameMap(taxonomyElement.assignedTaxonomy, false)}.ts`,
                                importValue: taxonomyNameMap(taxonomyElement.assignedTaxonomy)
                            });
                        })
                        .with(
                            P.union({ type: 'modular_content' }, { type: 'subpages' }),
                            (linkedItemsOrSubpagesElement) => {
                                return (linkedItemsOrSubpagesElement.allowedContentTypes ?? [])
                                    .filter((allowedContentType) => {
                                        // filter self-referencing types
                                        if (allowedContentType.codename === typeOrSnippet.codename) {
                                            return false;
                                        }
                                        return true;
                                    })
                                    .map((allowedContentType) => {
                                        const referencedTypeFilename: string = `${contentTypeFileNameMap(allowedContentType, false)}`;

                                        return getImportStatement({
                                            moduleResolution: config.moduleResolution,
                                            filePathOrPackage:
                                                typeOrSnippet instanceof ContentTypeModels.ContentType
                                                    ? `../${config.typeFolderName}/${referencedTypeFilename}.ts`
                                                    : `./${referencedTypeFilename}.ts`,
                                            importValue: `${contentTypeNameMap(allowedContentType)}`
                                        });
                                    });
                            }
                        )
                        .otherwise(() => [])
                )
                .flatMap((m) => m)
                .filter(isNotUndefined)
        );
    };

    const getContentTypeImports = (data: {
        typeOrSnippet: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet;
        flattenedElements: readonly FlattenedElement[];
    }): IExtractImportsResult => {
        const snippets = data.flattenedElements.map((m) => m.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [...getElementImports(data.typeOrSnippet, data.flattenedElements), ...snippetImports(snippets)]
                    .filter(isNotUndefined)
                    .filter(uniqueFilter),
                (importValue) => importValue
            ),
            contentTypeExtends:
                data.typeOrSnippet instanceof ContentTypeModels.ContentType && snippets.length
                    ? `& ${snippets
                          .map((snippet) => contentTypeSnippetNameMap(snippet))
                          .filter(uniqueFilter)
                          .join(' & ')}`
                    : undefined,
            typeName:
                data.typeOrSnippet instanceof ContentTypeModels.ContentType
                    ? contentTypeNameMap(data.typeOrSnippet)
                    : contentTypeSnippetNameMap(data.typeOrSnippet)
        };
    };

    const getDeliverySdkContentTypeImports = (flattenedElements: readonly FlattenedElement[]): string[] => {
        return ['IContentItem', ...(flattenedElements.length ? ['Elements'] : [])];
    };

    const getModelCode = (data: {
        typeOrSnippet: ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet;
    }): string => {
        const flattenedElements = getFlattenedElements(
            data.typeOrSnippet.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        const contentTypeImports = getContentTypeImports({
            typeOrSnippet: data.typeOrSnippet,
            flattenedElements: flattenedElements
        });

        const code = `
${getImportStatement({
    moduleResolution: config.moduleResolution,
    filePathOrPackage: deliveryConfig.npmPackageName,
    importValue: `${getDeliverySdkContentTypeImports(flattenedElements).join(', ')}`
})}
${contentTypeImports.imports.join('\n')}

${commentsManager.environmentInfo(config.environmentData.environment)}

/**
* ${toSafeString(data.typeOrSnippet.name)}
* 
* Id: ${data.typeOrSnippet.id}
* Codename: ${data.typeOrSnippet.codename}
*/
export type ${contentTypeImports.typeName} = IContentItem<{
    ${getElementsCode({
        flattenedElements: flattenedElements
    })}
}>${contentTypeImports.contentTypeExtends ? ` ${contentTypeImports.contentTypeExtends}` : ''};
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
        // filter out elements that are from snippets
        const filteredElements = data.flattenedElements.filter((m) => !m.fromSnippet);
        let code = '';
        for (let i = 0; i < filteredElements.length; i++) {
            const flattenedElement = filteredElements[i];
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

            if (i !== filteredElements.length - 1) {
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

    return {
        generateModels
    };
}
