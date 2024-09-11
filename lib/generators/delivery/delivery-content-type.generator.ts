import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';
import { match, P } from 'ts-pattern';
import { deliveryConfig, sharedTypesConfig } from '../../config.js';
import {
    importer as _importer,
    ContentTypeFileNameResolver,
    ContentTypeNameResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetNameResolver,
    FlattenedElement,
    GeneratedFile,
    getFlattenedElements,
    mapFilename,
    mapName,
    ModuleResolution,
    sortAlphabetically,
    TaxonomyNameResolver,
    TaxonomyTypeFileNameResolver,
    toGuidelinesComment,
    uniqueFilter,
    wrapComment
} from '../../core/index.js';
import {
    getCollectionCodenamesType,
    getContentTypeCodenamesType,
    getLanguageCodenamesType,
    getWorkflowCodenamesType,
    getWorkflowStepCodenamesType
} from '../shared/generator.utils.js';

interface ExtractImportsResult {
    readonly typeName: string;
    readonly imports: readonly string[];
    readonly contentTypeExtends: string | undefined;
}

type ContentTypeOrSnippet = Readonly<ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet>;

export interface DeliveryContentTypeGeneratorConfig {
    readonly moduleResolution: ModuleResolution;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
        readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
        readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
        readonly collections: readonly Readonly<CollectionModels.Collection>[];
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
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
    };
}

export function deliveryContentTypeGenerator(config: DeliveryContentTypeGeneratorConfig) {
    const fileResolvers = {
        snippet: mapFilename(config.fileResolvers?.snippet),
        contentType: mapFilename(config.fileResolvers?.contentType),
        taxonomy: mapFilename(config.fileResolvers?.taxonomy)
    };

    const importer = _importer(config.moduleResolution);

    const nameResolvers = {
        snippet: mapName(config.nameResolvers?.snippet, 'pascalCase'),
        contentType: mapName(config.nameResolvers?.contentType, 'pascalCase'),
        taxonomy: mapName(config.nameResolvers?.taxonomy, 'pascalCase')
    };

    const getSystemTypeImports = (): readonly string[] => {
        return [
            importer.importType({
                filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${deliveryConfig.coreCodenamesFilename}.ts`,
                importValue: [
                    sharedTypesConfig.collectionCodenames,
                    sharedTypesConfig.languageCodenames,
                    sharedTypesConfig.workflowCodenames,
                    sharedTypesConfig.workflowStepCodenames
                ]
                    .map((m) => m)
                    .join(', ')
            })
        ];
    };

    const getSnippetImports = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): readonly string[] => {
        if (snippets.length === 0) {
            return [];
        }

        return [
            importer.importType({
                filePathOrPackage: `../${deliveryConfig.contentTypeSnippetsFolderName}/index.ts`,
                importValue: snippets
                    .map((snippet) => nameResolvers.snippet(snippet))
                    .map((m) => m)
                    .filter(uniqueFilter)
                    .join(', ')
            })
        ];
    };

    const getReferencedTypesImports = (typeOrSnippet: ContentTypeOrSnippet, elements: readonly FlattenedElement[]): readonly string[] => {
        const referencedTypeNames = elements
            // only take elements that are not from snippets
            .filter((m) => !m.fromSnippet)
            .map((flattenedElement) => {
                return match(flattenedElement)
                    .returnType<string | string[]>()
                    .with(P.union({ type: 'modular_content' }, { type: 'subpages' }), (linkedItemsOrSubpagesElement) => {
                        return (linkedItemsOrSubpagesElement.allowedContentTypes ?? [])
                            .filter((allowedContentType) => {
                                // filter self-referencing types as they do not need to be importer
                                if (allowedContentType.codename === typeOrSnippet.codename) {
                                    return false;
                                }
                                return true;
                            })
                            .map((allowedContentType) => {
                                return nameResolvers.contentType(allowedContentType);
                            });
                    })
                    .otherwise(() => []);
            })
            .flatMap((m) => m)
            .filter(isNotUndefined)
            .filter(uniqueFilter);

        if (referencedTypeNames.length === 0) {
            return [];
        }

        return [
            importer.importType({
                filePathOrPackage:
                    typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet
                        ? `../${deliveryConfig.contentTypesFolderName}/index.ts`
                        : `./index.ts`,
                importValue: referencedTypeNames.join(', ')
            })
        ];
    };

    const getReferencedTaxonomyImports = (elements: readonly FlattenedElement[]): readonly string[] => {
        const taxonomyTypeNames = elements
            // only take elements that are not from snippets
            .filter((m) => !m.fromSnippet)
            .map((flattenedElement) => {
                return match(flattenedElement)
                    .returnType<string | undefined>()
                    .with({ type: 'taxonomy' }, (taxonomyElement) => {
                        if (!taxonomyElement.assignedTaxonomy) {
                            throw Error(`Invalid taxonomy for element '${taxonomyElement.codename}'`);
                        }

                        return nameResolvers.taxonomy(taxonomyElement.assignedTaxonomy);
                    })
                    .otherwise(() => undefined);
            })
            .filter(isNotUndefined)
            .filter(uniqueFilter);

        if (taxonomyTypeNames.length === 0) {
            return [];
        }

        return [
            importer.importType({
                filePathOrPackage: `../${deliveryConfig.taxonomiesFolderName}/index.ts`,
                importValue: taxonomyTypeNames.join(', ')
            })
        ];
    };

    const getContentTypeModelImports = (data: {
        readonly contentType: Readonly<ContentTypeModels.ContentType>;
        readonly flattenedElements: readonly FlattenedElement[];
    }): ExtractImportsResult => {
        const snippets = data.flattenedElements.map((m) => m.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [
                    ...getSystemTypeImports(),
                    ...getReferencedTypesImports(data.contentType, data.flattenedElements),
                    ...getReferencedTaxonomyImports(data.flattenedElements),
                    ...getSnippetImports(snippets)
                ]
                    .filter(isNotUndefined)
                    .filter(uniqueFilter),
                (importValue) => importValue
            ),
            contentTypeExtends: snippets.length
                ? `& ${sortAlphabetically(
                      snippets.map((snippet) => nameResolvers.snippet(snippet)).filter(uniqueFilter),
                      (snippetName) => snippetName
                  ).join(' & ')}`
                : undefined,
            typeName: nameResolvers.contentType(data.contentType)
        };
    };

    const getSnippetModelImports = (data: {
        readonly snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
        readonly flattenedElements: readonly FlattenedElement[];
    }): ExtractImportsResult => {
        const snippets = data.flattenedElements.map((m) => m.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [
                    ...getReferencedTypesImports(data.snippet, data.flattenedElements),
                    ...getReferencedTaxonomyImports(data.flattenedElements),
                    ...getSnippetImports(snippets)
                ]
                    .filter(isNotUndefined)
                    .filter(uniqueFilter),
                (importValue) => importValue
            ),
            contentTypeExtends: undefined,
            typeName: nameResolvers.snippet(data.snippet)
        };
    };

    const getDeliverySdkImports = (
        typeOrSnippet: ContentTypeOrSnippet,
        flattenedElements: readonly FlattenedElement[]
    ): readonly string[] => {
        const mainType =
            typeOrSnippet instanceof ContentTypeModels.ContentType
                ? deliveryConfig.sdkTypes.contentItem
                : deliveryConfig.sdkTypes.contentItemElements;

        return sortAlphabetically([mainType, ...(flattenedElements.length ? [deliveryConfig.sdkTypes.elements] : [])], (m) => m);
    };

    const getSnippetCode = (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): string => {
        const flattenedElements = getFlattenedElements(
            snippet.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        const importsResult = getSnippetModelImports({
            snippet,
            flattenedElements
        });

        return `
${importer.importType({
    filePathOrPackage: deliveryConfig.npmPackageName,
    importValue: `${getDeliverySdkImports(snippet, flattenedElements).join(', ')}`
})}
${importsResult.imports.join('\n')}

${wrapComment(`
* ${snippet.name}
* 
* Id: ${snippet.id}
* Codename: ${snippet.codename}    
`)}
export interface ${importsResult.typeName} extends ${deliveryConfig.sdkTypes.contentItemElements}
${getElementsCode(flattenedElements)};
`;
    };

    const getContentTypeCode = (contentType: Readonly<ContentTypeModels.ContentType>): string => {
        const flattenedElements = getFlattenedElements(
            contentType.elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        const importsResult = getContentTypeModelImports({
            contentType,
            flattenedElements
        });

        return `
${importer.importType({
    filePathOrPackage: deliveryConfig.npmPackageName,
    importValue: `${getDeliverySdkImports(contentType, flattenedElements).join(', ')}`
})}
${importsResult.imports.join('\n')}

${wrapComment(`
* ${contentType.name}
* 
* Id: ${contentType.id}
* Codename: ${contentType.codename}    
`)}
export type ${importsResult.typeName} = ${deliveryConfig.sdkTypes.contentItem}<
${getElementsCode(flattenedElements)}${importsResult.contentTypeExtends ? ` ${importsResult.contentTypeExtends}` : ''}, 
'${contentType.codename}', ${sharedTypesConfig.languageCodenames}, ${sharedTypesConfig.collectionCodenames}, ${sharedTypesConfig.workflowCodenames}, ${sharedTypesConfig.workflowStepCodenames}>;
`;
    };

    const createTypeModel = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${deliveryConfig.contentTypesFolderName}/${fileResolvers.contentType(type, true)}`,
            text: getContentTypeCode(type)
        };
    };

    const createSnippetModel = (type: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): GeneratedFile => {
        return {
            filename: `${deliveryConfig.contentTypeSnippetsFolderName}/${fileResolvers.contentType(type, true)}`,
            text: getSnippetCode(type)
        };
    };

    const getElementsCode = (flattenedElements: readonly FlattenedElement[]): string => {
        const filteredElements = flattenedElements
            // filter out elements that are from snippets
            .filter((m) => !m.fromSnippet);

        if (filteredElements.length === 0) {
            return `Record<string, never>`;
        }

        return (
            filteredElements.reduce<string>((code, element) => {
                const mappedType = mapElementType(element);

                if (!mappedType) {
                    return code;
                }

                return (code += `
                ${wrapComment(`
                * ${element.title}
                * 
                * Type: ${element.type}
                * Required: ${element.isRequired ? 'true' : 'false'}
                * Codename: ${element.codename}
                * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
                `)} 
                readonly ${element.codename}: ${deliveryConfig.sdkTypes.elements}.${mappedType};`);
            }, '{') + '}'
        );
    };

    const mapElementType = (element: FlattenedElement): string | undefined => {
        return match(element)
            .returnType<string | undefined>()
            .with({ type: 'text' }, () => 'TextElement')
            .with({ type: 'number' }, () => 'NumberElement')
            .with({ type: 'modular_content' }, (linkedItemsElement) => {
                if (!linkedItemsElement.allowedContentTypes?.length) {
                    return 'LinkedItemsElement';
                }
                return `LinkedItemsElement<${getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes ?? []).join(' | ')}>`;
            })
            .with({ type: 'subpages' }, (linkedItemsElement) => {
                if (!linkedItemsElement.allowedContentTypes?.length) {
                    return 'LinkedItemsElement';
                }
                return `LinkedItemsElement<${getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes ?? []).join(' | ')}>`;
            })
            .with({ type: 'asset' }, () => 'AssetsElement')
            .with({ type: 'date_time' }, () => 'DateTimeElement')
            .with({ type: 'rich_text' }, (richTextElement) => {
                if (!richTextElement.allowedContentTypes?.length) {
                    return 'RichTextElement';
                }
                return `RichTextElement<${getLinkedItemsAllowedTypes(richTextElement.allowedContentTypes ?? []).join(' | ')}>`;
            })
            .with({ type: 'multiple_choice' }, (multipleChoiceElement) => {
                if (!multipleChoiceElement.multipleChoiceOptions?.length) {
                    return 'MultipleChoiceElement';
                }
                return `MultipleChoiceElement<${multipleChoiceElement.multipleChoiceOptions.map((option) => `'${option.codename}'`).join(' | ')}>`;
            })
            .with({ type: 'url_slug' }, () => 'UrlSlugElement')
            .with({ type: 'taxonomy' }, (taxonomyElement) => {
                if (!taxonomyElement.assignedTaxonomy) {
                    return `TaxonomyElement`;
                }

                return `TaxonomyElement<${getTaxonomyTypeName(taxonomyElement.assignedTaxonomy)}, '${taxonomyElement.codename}'>`;
            })
            .with({ type: 'custom' }, () => 'CustomElement')
            .otherwise(() => undefined);
    };

    const getTaxonomyTypeName = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        return nameResolvers.taxonomy(taxonomy);
    };

    const getLinkedItemsAllowedTypes = (types: readonly Readonly<ContentTypeModels.ContentType>[]): readonly string[] => {
        if (!types.length) {
            return [deliveryConfig.sdkTypes.contentItem];
        }

        return types.map((type) => nameResolvers.contentType(type));
    };

    return {
        generateModels: (): {
            contentTypeFiles: readonly GeneratedFile[];
            snippetFiles: readonly GeneratedFile[];
        } => {
            return {
                contentTypeFiles: config.environmentData.types.map((type) => createTypeModel(type)),
                snippetFiles: config.environmentData.snippets.map((contentTypeSnippet) => createSnippetModel(contentTypeSnippet))
            };
        },
        getSystemFiles(): readonly GeneratedFile[] {
            return [
                {
                    filename: `${deliveryConfig.systemTypesFolderName}/${deliveryConfig.coreCodenamesFilename}.ts`,
                    text: `
                ${wrapComment(`\n * Type representing all languages\n`)}
                ${getLanguageCodenamesType(config.environmentData.languages)}

                ${wrapComment(`\n * Type representing all content types\n`)}
                ${getContentTypeCodenamesType(config.environmentData.types)}

                ${wrapComment(`\n * Type representing all collections\n`)}
                ${getCollectionCodenamesType(config.environmentData.collections)}

                ${wrapComment(`\n * Type representing all workflows\n`)}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}

                ${wrapComment(`\n * Type representing all worksflow steps across all workflows\n`)}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
            `
                }
            ];
        }
    };
}
