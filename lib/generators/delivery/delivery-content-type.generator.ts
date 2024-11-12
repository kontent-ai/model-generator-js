import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { coreConfig, deliveryConfig, sharedTypesConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import { FlattenedElement, GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined, sortAlphabetically, toGuidelinesComment, uniqueFilter } from '../../core/core.utils.js';
import { getFlattenedElements } from '../../core/element.utils.js';
import { importer as _importer } from '../../core/importer.js';
import {
    ContentTypeFileNameResolver,
    ContentTypeNameResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetNameResolver,
    mapFilename,
    mapName,
    TaxonomyNameResolver,
    TaxonomyTypeFileNameResolver
} from '../../core/resolvers.js';
import {
    getCollectionCodenamesType,
    getContentTypeCodenamesType,
    getElementCodenamesType,
    getLanguageCodenamesType,
    getWorkflowCodenamesType,
    getWorkflowStepCodenamesType
} from '../shared/type-codename.generator.js';
import { deliveryTypeGuardGenerator } from './delivery-type-guard.generator.js';

interface ExtractImportsResult {
    readonly typeName: string;
    readonly imports: readonly string[];
    readonly contentTypeExtends: string | undefined;
}

type ContentTypeOrSnippet = Readonly<ContentTypeModels.ContentType | ContentTypeSnippetModels.ContentTypeSnippet>;

export interface DeliveryContentTypeGeneratorConfig {
    readonly moduleFileExtension: ModuleFileExtension;

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

    const importer = _importer(config.moduleFileExtension);

    const nameResolvers = {
        snippet: mapName(config.nameResolvers?.snippet, 'pascalCase'),
        contentType: mapName(config.nameResolvers?.contentType, 'pascalCase'),
        taxonomy: mapName(config.nameResolvers?.taxonomy, 'pascalCase')
    };

    const getContentTypeSystemImports = (): readonly string[] => {
        return [
            importer.importType({
                filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${coreConfig.barrelExportFilename}`,
                importValue: [deliveryConfig.coreContentTypeName].join(', ')
            })
        ];
    };

    const getSnippetImports = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): readonly string[] => {
        if (snippets.length === 0) {
            return [];
        }

        return [
            importer.importType({
                filePathOrPackage: `../${deliveryConfig.contentTypeSnippetsFolderName}/${coreConfig.barrelExportFilename}`,
                importValue: snippets
                    .map((snippet) => nameResolvers.snippet(snippet))
                    .map((m) => m)
                    .filter(uniqueFilter)
                    .join(', ')
            })
        ];
    };

    const getReferencedTypeImports = (typeOrSnippet: ContentTypeOrSnippet, elements: readonly FlattenedElement[]): readonly string[] => {
        const referencedTypeNames = elements
            // only take elements that are not from snippets
            .filter((m) => !m.fromSnippet)
            .map((flattenedElement) => {
                return match(flattenedElement)
                    .returnType<string | string[]>()
                    .with(
                        P.union({ type: 'modular_content' }, { type: 'subpages' }, { type: 'rich_text' }),
                        (alementWithAllowedContentTypes) => {
                            return (alementWithAllowedContentTypes.allowedContentTypes ?? [])
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
                        }
                    )
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
                        ? `../${deliveryConfig.contentTypesFolderName}/${coreConfig.barrelExportFilename}`
                        : `./${coreConfig.barrelExportFilename}`,
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
                filePathOrPackage: `../${deliveryConfig.taxonomiesFolderName}/${coreConfig.barrelExportFilename}`,
                importValue: taxonomyTypeNames.join(', ')
            })
        ];
    };

    const getContentTypeModelImports = (data: {
        readonly contentType: Readonly<ContentTypeModels.ContentType>;
        readonly flattenedElements: readonly FlattenedElement[];
    }): ExtractImportsResult => {
        const snippets = data.flattenedElements.map((flattenedElement) => flattenedElement.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [
                    ...getContentTypeSystemImports(),
                    ...getReferencedTypeImports(data.contentType, data.flattenedElements),
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
        const snippets = data.flattenedElements.map((flattenedElement) => flattenedElement.fromSnippet).filter(isNotUndefined);

        return {
            imports: sortAlphabetically(
                [
                    ...getReferencedTypeImports(data.snippet, data.flattenedElements),
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

    const getTypeDeliverySdkImports = (
        typeOrSnippet: ContentTypeOrSnippet,
        flattenedElements: readonly FlattenedElement[]
    ): readonly string[] => {
        return sortAlphabetically(
            [
                ...(typeOrSnippet instanceof ContentTypeSnippetModels.ContentTypeSnippet ? [deliveryConfig.sdkTypes.snippet] : []),
                ...(flattenedElements.length ? [deliveryConfig.sdkTypes.elements] : [])
            ],
            (importValue) => importValue
        );
    };

    const getSnippetCode = (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): string => {
        const flattenedElements = getFlattenedElements({
            elements: snippet.elements,
            snippets: config.environmentData.snippets,
            taxonomies: config.environmentData.taxonomies,
            types: config.environmentData.types
        });

        const importsResult = getSnippetModelImports({
            snippet,
            flattenedElements
        });

        const nameOfTypeRepresentingAllElementCodenames = getNameOfTypeRepresentingAllElementCodenames(snippet);

        return `
${importer.importType({
    filePathOrPackage: deliveryConfig.npmPackageName,
    importValue: `${getTypeDeliverySdkImports(snippet, flattenedElements).join(', ')}`
})}
${importsResult.imports.join('\n')}

${wrapComment(`
* ${snippet.name}
* 
* Id: ${snippet.id}
* Codename: ${snippet.codename}    
`)}
export type ${importsResult.typeName} = ${deliveryConfig.sdkTypes.snippet}<${nameOfTypeRepresentingAllElementCodenames},
${getElementsCode(flattenedElements)}>;

${wrapComment(`
* Type representing all available element codenames for ${snippet.name}
`)}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)}
`;
    };

    const getContentTypeCode = (contentType: Readonly<ContentTypeModels.ContentType>): string => {
        const flattenedElements = getFlattenedElements({
            elements: contentType.elements,
            snippets: config.environmentData.snippets,
            taxonomies: config.environmentData.taxonomies,
            types: config.environmentData.types
        });

        const importsResult = getContentTypeModelImports({
            contentType,
            flattenedElements
        });

        const nameOfTypeRepresentingAllElementCodenames = getNameOfTypeRepresentingAllElementCodenames(contentType);

        return `
${importer.importType({
    filePathOrPackage: deliveryConfig.npmPackageName,
    importValue: `${getTypeDeliverySdkImports(contentType, flattenedElements).join(', ')}`
})}
${importsResult.imports.join('\n')}

${wrapComment(`
* ${contentType.name}
* 
* Id: ${contentType.id}
* Codename: ${contentType.codename}    
`)}
export type ${importsResult.typeName} = ${deliveryConfig.coreContentTypeName}<
${getElementsCode(flattenedElements)}${importsResult.contentTypeExtends ? ` ${importsResult.contentTypeExtends}` : ''}, 
'${contentType.codename}'>

${wrapComment(`
* Type representing all available element codenames for ${contentType.name}
`)}
${getContentTypeElementCodenamesType(nameOfTypeRepresentingAllElementCodenames, flattenedElements)};

${wrapComment(`
* Type guard for ${contentType.name}
*
* Codename: ${contentType.codename}
`)}
${deliveryTypeGuardGenerator(config).getTypeGuardFunction(contentType)};
`;
    };

    const createTypeModel = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: fileResolvers.contentType(type, true),
            text: getContentTypeCode(type)
        };
    };

    const createSnippetModel = (type: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>): GeneratedFile => {
        return {
            filename: fileResolvers.contentType(type, true),
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

    const getNameOfTypeRepresentingAllElementCodenames = (typeOrSnippet: ContentTypeOrSnippet): string => {
        return `${
            typeOrSnippet instanceof ContentTypeModels.ContentType
                ? nameResolvers.contentType(typeOrSnippet)
                : nameResolvers.snippet(typeOrSnippet)
        }ElementCodenames`;
    };

    const getContentTypeElementCodenamesType = (typeName: string, flattenedElements: readonly FlattenedElement[]): string => {
        if (flattenedElements.length === 0) {
            return `export type ${typeName} = never`;
        }
        return `export type ${typeName} = ${flattenedElements.map((element) => `'${element.codename}'`).join(' | ')};`;
    };

    const mapElementType = (element: FlattenedElement): string | undefined => {
        return match(element)
            .returnType<string | undefined>()
            .with({ type: 'text' }, () => 'TextElement')
            .with({ type: 'number' }, () => 'NumberElement')
            .with({ type: 'modular_content' }, (linkedItemsElement) => {
                return `LinkedItemsElement<${
                    linkedItemsElement.allowedContentTypes?.length
                        ? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(' | ')
                        : deliveryConfig.coreContentTypeName
                }>`;
            })
            .with({ type: 'subpages' }, (linkedItemsElement) => {
                return `LinkedItemsElement<${
                    linkedItemsElement.allowedContentTypes?.length
                        ? getLinkedItemsAllowedTypes(linkedItemsElement.allowedContentTypes).join(' | ')
                        : deliveryConfig.coreContentTypeName
                }>`;
            })
            .with({ type: 'asset' }, () => 'AssetsElement')
            .with({ type: 'date_time' }, () => 'DateTimeElement')
            .with({ type: 'rich_text' }, (richTextElement) => {
                return `RichTextElement<${
                    richTextElement.allowedContentTypes?.length
                        ? getLinkedItemsAllowedTypes(richTextElement.allowedContentTypes).join(' | ')
                        : deliveryConfig.coreContentTypeName
                }>`;
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

                return `TaxonomyElement<${nameResolvers.taxonomy(taxonomyElement.assignedTaxonomy)}, '${taxonomyElement.codename}'>`;
            })
            .with({ type: 'custom' }, () => 'CustomElement')
            .otherwise(() => undefined);
    };

    const getLinkedItemsAllowedTypes = (types: readonly Readonly<ContentTypeModels.ContentType>[]): readonly string[] => {
        if (!types.length) {
            return [deliveryConfig.sdkTypes.contentItem];
        }

        return types.map((type) => nameResolvers.contentType(type));
    };

    const getCoreContentTypeFile = (): GeneratedFile => {
        const sdkImports: readonly string[] = [deliveryConfig.sdkTypes.contentItem, deliveryConfig.sdkTypes.contentItemElements];

        const codenameImports: readonly string[] = [
            sharedTypesConfig.contentTypeCodenames,
            sharedTypesConfig.collectionCodenames,
            sharedTypesConfig.languageCodenames,
            sharedTypesConfig.workflowCodenames,
            sharedTypesConfig.workflowStepCodenames
        ];

        const contentTypeGenericArgName: string = 'TContentTypeCodename';
        const elementsGenericArgName: string = 'TElements';

        return {
            filename: `${deliveryConfig.coreTypeFilename}.ts`,
            text: `
              ${importer.importType({
                  filePathOrPackage: deliveryConfig.npmPackageName,
                  importValue: `${sdkImports.join(', ')}`
              })}
                ${importer.importType({
                    filePathOrPackage: `./${deliveryConfig.coreCodenamesFilename}.ts`,
                    importValue: `${codenameImports.join(', ')}`
                })}

                ${wrapComment(`\n * Core content type used in favor of generic '${deliveryConfig.sdkTypes.contentItem}'\n`)}
                export type ${deliveryConfig.coreContentTypeName}<
                        ${elementsGenericArgName} extends ${deliveryConfig.sdkTypes.contentItemElements} = ${deliveryConfig.sdkTypes.contentItemElements}, 
                        ${contentTypeGenericArgName} extends ${sharedTypesConfig.contentTypeCodenames} = ${sharedTypesConfig.contentTypeCodenames}
                    > = ${deliveryConfig.sdkTypes.contentItem}<
                    ${elementsGenericArgName},
                    ${contentTypeGenericArgName},
                    ${sharedTypesConfig.languageCodenames},
                    ${sharedTypesConfig.collectionCodenames},
                    ${sharedTypesConfig.workflowCodenames},
                    ${sharedTypesConfig.workflowStepCodenames}
                >;
            `
        };
    };

    const getCodenamesFile = (): GeneratedFile => {
        return {
            filename: `${deliveryConfig.coreCodenamesFilename}.ts`,
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

                 ${wrapComment(`\n * Type representing all element codenames across all content types\n`)}
                ${getElementCodenamesType(config.environmentData.types, config.environmentData.snippets)}
            `
        };
    };

    return {
        generateModels: (): {
            contentTypeFiles: GeneratedSet;
            snippetFiles: GeneratedSet;
        } => {
            return {
                contentTypeFiles: {
                    folderName: deliveryConfig.contentTypesFolderName,
                    files: config.environmentData.types.map((type) => createTypeModel(type))
                },
                snippetFiles: {
                    folderName: deliveryConfig.contentTypeSnippetsFolderName,
                    files: config.environmentData.snippets.map((contentTypeSnippet) => createSnippetModel(contentTypeSnippet))
                }
            };
        },
        getSystemFiles(): GeneratedSet {
            return {
                folderName: deliveryConfig.systemTypesFolderName,
                files: [getCoreContentTypeFile(), getCodenamesFile()]
            };
        }
    };
}
