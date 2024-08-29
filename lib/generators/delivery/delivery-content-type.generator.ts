import { match, P } from 'ts-pattern';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';
import {
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    TaxonomyModels
} from '@kontent-ai/management-sdk';

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

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
        readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
    };

    readonly fileResolvers?: {
        readonly contentType?: ContentTypeFileNameResolver;
        readonly snippet?: ContentTypeSnippetFileNameResolver;
        readonly taxonomy?: TaxonomyTypeFileNameResolver;
    };

    readonly nameResolvers?: {
        readonly contentType?: ContentTypeNameResolver;
        readonly snippet?: ContentTypeSnippetNameResolver;
        readonly taxonomy?: TaxonomyNameResolver;
        readonly element?: GeneratorElementResolver;
    };
}

export function deliveryContentTypeGenerator(config: DeliveryContentTypeGeneratorConfig) {
    // prepare resolvers
    const fileResolvers = {
        snippet: mapFilename(config.fileResolvers?.snippet),
        contentType: mapFilename(config.fileResolvers?.contentType),
        taxonomy: mapFilename(config.fileResolvers?.taxonomy)
    };

    const nameResolvers = {
        snippet: mapName(config.nameResolvers?.snippet, 'pascalCase'),
        contentType: mapName(config.nameResolvers?.contentType, 'pascalCase'),
        element: mapElementName(config.nameResolvers?.element, 'camelCase'),
        taxonomy: mapName(config.nameResolvers?.taxonomy, 'pascalCase')
    };

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
                filePathOrPackage: `../${deliveryConfig.contentTypeSnippetsFolderName}/${fileResolvers.snippet(
                    snippet,
                    false
                )}.ts`,
                importValue: nameResolvers.snippet(snippet)
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
                                filePathOrPackage: `../${deliveryConfig.taxonomiesFolderName}/${fileResolvers.taxonomy(taxonomyElement.assignedTaxonomy, false)}.ts`,
                                importValue: nameResolvers.taxonomy(taxonomyElement.assignedTaxonomy)
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
                                        const referencedTypeFilename: string = `${fileResolvers.contentType(allowedContentType, false)}`;

                                        return getImportStatement({
                                            moduleResolution: config.moduleResolution,
                                            filePathOrPackage:
                                                typeOrSnippet instanceof ContentTypeModels.ContentType
                                                    ? `../${deliveryConfig.contentTypesFolderName}/${referencedTypeFilename}.ts`
                                                    : `./${referencedTypeFilename}.ts`,
                                            importValue: `${nameResolvers.contentType(allowedContentType)}`
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
                          .map((snippet) => nameResolvers.snippet(snippet))
                          .filter(uniqueFilter)
                          .join(' & ')}`
                    : undefined,
            typeName:
                data.typeOrSnippet instanceof ContentTypeModels.ContentType
                    ? nameResolvers.contentType(data.typeOrSnippet)
                    : nameResolvers.snippet(data.typeOrSnippet)
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
            filename: `${deliveryConfig.contentTypesFolderName}/${fileResolvers.contentType(type, true)}`,
            text: getModelCode(type)
        };
    };

    const createContentTypeSnippetModel = (
        snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>
    ): GeneratedFile => {
        return {
            filename: `${deliveryConfig.contentTypeSnippetsFolderName}/${fileResolvers.snippet(snippet, true)}`,
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
                    const elementName = nameResolvers.element(element.originalElement);

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
        return element.assignedTaxonomy ? nameResolvers.taxonomy(element.assignedTaxonomy) : undefined;
    };

    const getLinkedItemsAllowedTypes = (
        types: readonly Readonly<ContentTypeModels.ContentType>[]
    ): readonly string[] => {
        if (!types.length) {
            return ['IContentItem'];
        }

        return types.map((type) => nameResolvers.contentType(type));
    };

    return {
        generateModels
    };
}
