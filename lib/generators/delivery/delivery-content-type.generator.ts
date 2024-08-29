import { match, P } from 'ts-pattern';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';
import {
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    TaxonomyModels
} from '@kontent-ai/management-sdk';

import { commentsManager as _commentsManager } from '../../comments/index.js';
import {
    ContentTypeFileNameResolver,
    ContentTypeNameResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetNameResolver,
    deliveryConfig,
    FlattenedElement,
    GeneratedFile,
    getFlattenedElements,
    getImportStatement,
    mapElementName,
    mapFilename,
    mapName,
    removeLineEndings,
    sortAlphabetically,
    TaxonomyTypeFileNameResolver,
    TaxonomyNameResolver,
    toSafeString,
    uniqueFilter,
    ModuleResolution,
    GeneratorElementResolver
} from '../../core/index.js';

interface ExtractImportsResult {
    readonly typeName: string;
    readonly imports: readonly string[];
    readonly contentTypeExtends: string | undefined;
}

export interface DeliveryContentTypeGeneratorConfig {
    readonly addTimestamp: boolean;
    readonly addEnvironmentInfo: boolean;
    readonly moduleResolution: ModuleResolution;

    readonly folders: {
        readonly typeFolderName: string;
        readonly typeSnippetsFolderName: string;
        readonly taxonomyFolderName: string;
    };

    readonly fileResolvers: {
        readonly contentTypeFileResolver?: ContentTypeFileNameResolver;
        readonly contentTypeSnippetFileResolver?: ContentTypeSnippetFileNameResolver;
        readonly taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
    };

    readonly nameResolvers: {
        readonly contentTypeNameResolver?: ContentTypeNameResolver;
        readonly snippetNameResolver?: ContentTypeSnippetNameResolver;
        readonly taxonomyNameResolver?: TaxonomyNameResolver;
        readonly elementNameResolver?: GeneratorElementResolver;
    };

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
    const contentTypeSnippetFileNameMap = mapFilename(config.fileResolvers.contentTypeSnippetFileResolver);
    const contentTypeFileNameMap = mapFilename(config.fileResolvers.contentTypeFileResolver);
    const taxonomyFileNameMap = mapFilename(config.fileResolvers.taxonomyFileResolver);

    const contentTypeSnippetNameMap = mapName(config.nameResolvers.snippetNameResolver, 'pascalCase');
    const contentTypeNameMap = mapName(config.nameResolvers.contentTypeNameResolver, 'pascalCase');
    const elementNameMap = mapElementName(config.nameResolvers.elementNameResolver, 'camelCase');
    const taxonomyNameMap = mapName(config.nameResolvers.taxonomyNameResolver, 'pascalCase');

    const generateModels = (): {
        contentTypeFiles: readonly GeneratedFile[];
        snippetFiles: readonly GeneratedFile[];
    } => {
        return {
            contentTypeFiles: config.environmentData.types.map((type) => createContentTypeModel(type)),
            snippetFiles: config.environmentData.snippets.map((contentTypeSnippet) =>
                createContentTypeSnippetModel(contentTypeSnippet)
            )
        };
    };

    const getSnippetImports = (
        snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]
    ): readonly string[] => {
        return snippets.map((snippet) => {
            return getImportStatement({
                moduleResolution: config.moduleResolution,
                filePathOrPackage: `../${config.folders.typeSnippetsFolderName}/${contentTypeSnippetFileNameMap(
                    snippet,
                    false
                )}.ts`,
                importValue: contentTypeSnippetNameMap(snippet)
            });
        });
    };

    const getElementImports = (
        typeOrSnippet: Readonly<ContentTypeModels.ContentType> | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
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
                                filePathOrPackage: `../${config.folders.taxonomyFolderName}/${taxonomyFileNameMap(taxonomyElement.assignedTaxonomy, false)}.ts`,
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
                                                    ? `../${config.folders.typeFolderName}/${referencedTypeFilename}.ts`
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
                .filter(uniqueFilter)
        );
    };

    const getContentTypeImports = (data: {
        readonly typeOrSnippet:
            | Readonly<ContentTypeModels.ContentType>
            | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
        readonly flattenedElements: readonly FlattenedElement[];
    }): ExtractImportsResult => {
        const snippets = data.flattenedElements.map((m) => m.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [...getElementImports(data.typeOrSnippet, data.flattenedElements), ...getSnippetImports(snippets)]
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

    const getDeliverySdkContentTypeImports = (flattenedElements: readonly FlattenedElement[]): readonly string[] => {
        return ['IContentItem', ...(flattenedElements.length ? ['Elements'] : [])];
    };

    const getModelCode = (
        typeOrSnippet: Readonly<ContentTypeModels.ContentType> | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>
    ): string => {
        const flattenedElements = getFlattenedElements(
            typeOrSnippet.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        const contentTypeImports = getContentTypeImports({
            typeOrSnippet,
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
* ${toSafeString(typeOrSnippet.name)}
* 
* Id: ${typeOrSnippet.id}
* Codename: ${typeOrSnippet.codename}
*/
export type ${contentTypeImports.typeName} = IContentItem<{
    ${getElementsCode(flattenedElements)}
}>${contentTypeImports.contentTypeExtends ? ` ${contentTypeImports.contentTypeExtends}` : ''};
`;
        return code;
    };

    const createContentTypeModel = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${config.folders.typeFolderName}/${contentTypeFileNameMap(type, true)}`,
            text: getModelCode(type)
        };
    };

    const createContentTypeSnippetModel = (
        snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>
    ): GeneratedFile => {
        return {
            filename: `${config.folders.typeSnippetsFolderName}/${contentTypeSnippetFileNameMap(snippet, true)}`,
            text: getModelCode(snippet)
        };
    };

    const getElementsCode = (flattenedElements: readonly FlattenedElement[]): string => {
        return (
            flattenedElements
                // filter out elements that are from snippets
                .filter((m) => !m.fromSnippet)
                .reduce<string>((code, element) => {
                    const mappedType = mapElementType(element);
                    const elementName = elementNameMap(element.originalElement);

                    if (!mappedType || !elementName) {
                        return code;
                    }

                    return (code += `\n
                /**
                * ${element.title} (${element.type})
                * 
                * Required: ${element.isRequired ? 'true' : 'false'}
                * Codename: ${element.codename}
                * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toSafeString(removeLineEndings(element.guidelines))}` : ''}
                */ 
                ${elementName}: Elements.${mappedType};`);
                }, '')
        );
    };

    const mapElementType = (element: FlattenedElement): string | undefined => {
        return match(element)
            .returnType<string | undefined>()
            .with({ type: 'text' }, () => 'TextElement')
            .with({ type: 'number' }, () => 'NumberElement')
            .with({ type: 'modular_content' }, (linkedItemsElement) => {
                return `LinkedItemsElement<${getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes ?? []).join(' | ')}>`;
            })
            .with({ type: 'asset' }, () => 'AssetsElement')
            .with({ type: 'date_time' }, () => 'DateTimeElement')
            .with({ type: 'rich_text' }, () => 'RichTextElement')
            .with({ type: 'multiple_choice' }, () => 'MultipleChoiceElement')
            .with({ type: 'url_slug' }, () => 'UrlSlugElement')
            .with({ type: 'taxonomy' }, (taxonomyElement) => {
                const taxonomyName = getTaxonomyTypeName(taxonomyElement);
                return taxonomyName ? `TaxonomyElement<${taxonomyName}>` : `TaxonomyElement`;
            })
            .with({ type: 'custom' }, () => 'CustomElement')
            .otherwise(() => undefined);
    };

    const getTaxonomyTypeName = (element: FlattenedElement): string | undefined => {
        return element.assignedTaxonomy ? taxonomyNameMap(element.assignedTaxonomy) : undefined;
    };

    const getLinkedItemsAllowedTypes = (
        types: readonly Readonly<ContentTypeModels.ContentType>[]
    ): readonly string[] => {
        if (!types.length) {
            return ['IContentItem'];
        }

        return types.map((type) => contentTypeNameMap(type));
    };

    return {
        generateModels
    };
}
