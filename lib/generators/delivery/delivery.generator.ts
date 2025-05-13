import type {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { deliveryConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined, uniqueFilter } from '../../core/core.utils.js';
import { getFlattenedElements } from '../../core/element.utils.js';
import { getImporter } from '../../core/importer.js';
import type { FilenameResolver, NameResolver } from '../../core/resolvers.js';
import type { DeliveryElement } from './delivery-entity.generator.js';
import { getDeliveryEntityGenerator } from './delivery-entity.generator.js';

export type DeliveryFileResolvers = {
    readonly contentType?: FilenameResolver<ContentTypeModels.ContentType>;
    readonly snippet?: FilenameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
    readonly taxonomy?: FilenameResolver<TaxonomyModels.Taxonomy>;
    readonly language?: FilenameResolver<LanguageModels.LanguageModel>;
    readonly collection?: FilenameResolver<CollectionModels.Collection>;
    readonly workflow?: FilenameResolver<WorkflowModels.Workflow>;
};

export type DeliveryNameResolvers = {
    readonly contentType?: NameResolver<ContentTypeModels.ContentType>;
    readonly snippet?: NameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
    readonly taxonomy?: NameResolver<TaxonomyModels.Taxonomy>;
    readonly language?: NameResolver<LanguageModels.LanguageModel>;
    readonly collection?: NameResolver<CollectionModels.Collection>;
    readonly workflow?: NameResolver<WorkflowModels.Workflow>;
};

export interface DeliveryGeneratorConfig {
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

    readonly fileResolvers?: DeliveryFileResolvers;
    readonly nameResolvers?: DeliveryNameResolvers;
}

export function deliveryGenerator(config: DeliveryGeneratorConfig) {
    const importer = getImporter(config.moduleFileExtension);

    const getUniqueDeliveryElements = (): readonly Readonly<DeliveryElement>[] => {
        const flattenedElements = getFlattenedElements({
            elements: [
                ...config.environmentData.types.flatMap((type) => type.elements),
                ...config.environmentData.snippets.flatMap((snippet) => snippet.elements)
            ],
            snippets: config.environmentData.snippets,
            taxonomies: config.environmentData.taxonomies,
            types: config.environmentData.types
        });

        const uniqueElementCodenames: readonly string[] = flattenedElements
            .map((element) => element.codename)
            .filter(isNotUndefined)
            .filter(uniqueFilter);

        return flattenedElements
            .filter((element) => uniqueElementCodenames.includes(element.codename))
            .map<DeliveryElement>((m) => ({
                codename: m.codename,
                name: m.title
            }));
    };

    const entityGenerators = {
        collections: getDeliveryEntityGenerator({
            ...config,
            entities: config.environmentData.collections,
            entityType: 'Collection',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false
        }),
        languages: getDeliveryEntityGenerator({
            ...config,
            entities: config.environmentData.languages,
            entityType: 'Language',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false
        }),
        workflows: getDeliveryEntityGenerator({
            ...config,
            entities: config.environmentData.workflows,
            entityType: 'Workflow',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false
        }),
        taxonomies: getDeliveryEntityGenerator({
            ...config,
            entities: config.environmentData.taxonomies,
            entityType: 'Taxonomy',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false
        }),
        contentType: getDeliveryEntityGenerator({
            ...config,
            entities: config.environmentData.types,
            entityType: 'ContentType',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false
        }),
        elements: getDeliveryEntityGenerator({
            ...config,
            entities: getUniqueDeliveryElements(),
            entityType: 'Element',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: true
        })
    };

    const getDeliverySystemFile = (): GeneratedFile => {
        const sdkImports = [
            deliveryConfig.sdkTypes.contentItem,
            deliveryConfig.sdkTypes.contentItemElements,
            deliveryConfig.sdkTypes.deliveryClient
        ] as const;

        const contentTypeGenericArgName: string = 'TContentTypeCodename';
        const elementsGenericArgName: string = 'TElements';
        const elementCodenamesGenericArgName: string = 'TElementCodenames';

        return {
            filename: `${deliveryConfig.coreTypeFilename}.ts`,
            text: `
              ${importer.importType({
                  filePathOrPackage: deliveryConfig.npmPackageName,
                  importValue: `${sdkImports.join(', ')}`
              })}
                ${Object.values(entityGenerators)
                    .map((generator) => {
                        const importValues: readonly string[] = [
                            generator.entityNames.entityCodenamesTypeName,
                            ...match(generator.entityType)
                                .with('Workflow', () => [deliveryConfig.workflowStepCodenames])
                                .otherwise(() => [])
                        ];

                        return importer.importType({
                            filePathOrPackage: `../${generator.entityNames.entityFolderName}/${generator.entityNames.mainEntityFilename}`,
                            importValue: `${importValues.join(', ')}`
                        });
                    })
                    .join('\n')}

                ${wrapComment(`\n * Core content type used in favor of default '${deliveryConfig.sdkTypes.contentItem}'\n`)}
                export type ${deliveryConfig.coreContentTypeName}<
                        ${elementCodenamesGenericArgName} extends string = string,
                        ${elementsGenericArgName} extends ${deliveryConfig.sdkTypes.contentItemElements}<${elementCodenamesGenericArgName}> = ${deliveryConfig.sdkTypes.contentItemElements}<${elementCodenamesGenericArgName}>, 
                        ${contentTypeGenericArgName} extends ${entityGenerators.contentType.entityNames.entityCodenamesTypeName} = ${entityGenerators.contentType.entityNames.entityCodenamesTypeName}
                    > = ${deliveryConfig.sdkTypes.contentItem}<
                    ${elementsGenericArgName},
                    ${contentTypeGenericArgName},
                    ${entityGenerators.languages.entityNames.entityCodenamesTypeName},
                    ${entityGenerators.collections.entityNames.entityCodenamesTypeName},
                    ${entityGenerators.workflows.entityNames.entityCodenamesTypeName},
                    ${deliveryConfig.workflowStepCodenames}
                >;

                ${wrapComment(`\n * Core types for '${deliveryConfig.sdkTypes.deliveryClient}'\n`)}
                export type ${deliveryConfig.coreDeliveryClientTypesTypeName} = {
                    readonly collectionCodenames: ${entityGenerators.collections.entityNames.entityCodenamesTypeName};
                    readonly contentItemType: ${deliveryConfig.coreContentTypeName};
                    readonly contentTypeCodenames: ${entityGenerators.contentType.entityNames.entityCodenamesTypeName};
                    readonly elementCodenames: ${entityGenerators.elements.entityNames.entityCodenamesTypeName};
                    readonly languageCodenames: ${entityGenerators.languages.entityNames.entityCodenamesTypeName};
                    readonly taxonomyCodenames: ${entityGenerators.taxonomies.entityNames.entityCodenamesTypeName};
                    readonly workflowCodenames: ${entityGenerators.workflows.entityNames.entityCodenamesTypeName};
                    readonly workflowStepCodenames: ${deliveryConfig.workflowStepCodenames};
                };

                ${wrapComment(`\n * Typed delivery client in favor of default '${deliveryConfig.sdkTypes.deliveryClient}'\n`)}
                export type ${deliveryConfig.coreDeliveryClientTypeName} = IDeliveryClient<${deliveryConfig.coreDeliveryClientTypesTypeName}>;
            `
        };
    };

    return {
        getTypeFiles: (): readonly GeneratedSet[] => {
            return Object.values(entityGenerators).map((generator) => generator.generateEntityTypes());
        },
        getSystemFiles(): GeneratedSet {
            return {
                folderName: deliveryConfig.systemTypesFolderName,
                files: [getDeliverySystemFile()]
            };
        }
    };
}
