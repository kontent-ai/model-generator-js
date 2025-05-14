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
            entities: config.environmentData.collections,
            entityType: 'Collection',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        languages: getDeliveryEntityGenerator({
            entities: config.environmentData.languages,
            entityType: 'Language',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        workflows: getDeliveryEntityGenerator({
            entities: config.environmentData.workflows,
            entityType: 'Workflow',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        taxonomies: getDeliveryEntityGenerator({
            entities: config.environmentData.taxonomies,
            entityType: 'Taxonomy',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        contentTypes: getDeliveryEntityGenerator({
            entities: config.environmentData.types,
            entityType: 'Type',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        snippets: getDeliveryEntityGenerator({
            entities: config.environmentData.snippets,
            entityType: 'Snippet',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: false,
            deliveryGeneratorConfig: config
        }),
        elements: getDeliveryEntityGenerator({
            entities: getUniqueDeliveryElements(),
            entityType: 'Element',
            moduleFileExtension: config.moduleFileExtension,
            generateOnlyCoreFile: true,
            deliveryGeneratorConfig: config
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
            filename: `${deliveryConfig.mainSystemFilename}.ts`,
            text: `
              ${importer.importType({
                  filePathOrPackage: deliveryConfig.npmPackageName,
                  importValue: `${sdkImports.join(', ')}`
              })}
                ${Object.values(entityGenerators)
                    .filter((generator) => generator.entityType !== 'Snippet') // snippets are not needed in the system file
                    .map((generator) => {
                        const importValues: readonly string[] = [
                            generator.entityNames.codenamesTypeName,
                            ...match(generator.entityType)
                                .with('Workflow', () => [entityGenerators.workflows.entityNames.allStepsNames.codenamesTypeName])
                                .otherwise(() => [])
                        ];

                        return importer.importType({
                            filePathOrPackage: `../${generator.entityNames.folderName}/${generator.entityNames.mainFilename}`,
                            importValue: `${importValues.join(', ')}`
                        });
                    })
                    .join('\n')}

                ${wrapComment(`\n * Core content type used in favor of default '${deliveryConfig.sdkTypes.contentItem}'\n`)}
                export type ${deliveryConfig.coreContentTypeName}<
                        ${elementCodenamesGenericArgName} extends string = string,
                        ${elementsGenericArgName} extends ${deliveryConfig.sdkTypes.contentItemElements}<${elementCodenamesGenericArgName}> = ${deliveryConfig.sdkTypes.contentItemElements}<${elementCodenamesGenericArgName}>, 
                        ${contentTypeGenericArgName} extends ${entityGenerators.contentTypes.entityNames.codenamesTypeName} = ${entityGenerators.contentTypes.entityNames.codenamesTypeName}
                    > = ${deliveryConfig.sdkTypes.contentItem}<
                    ${elementsGenericArgName},
                    ${contentTypeGenericArgName},
                    ${entityGenerators.languages.entityNames.codenamesTypeName},
                    ${entityGenerators.collections.entityNames.codenamesTypeName},
                    ${entityGenerators.workflows.entityNames.codenamesTypeName},
                    ${entityGenerators.workflows.entityNames.allStepsNames.codenamesTypeName}
                >;

                ${wrapComment(`\n * Core types for '${deliveryConfig.sdkTypes.deliveryClient}'\n`)}
                export type ${deliveryConfig.coreDeliveryClientTypesTypeName} = {
                    readonly collectionCodenames: ${entityGenerators.collections.entityNames.codenamesTypeName};
                    readonly contentItemType: ${deliveryConfig.coreContentTypeName};
                    readonly contentTypeCodenames: ${entityGenerators.contentTypes.entityNames.codenamesTypeName};
                    readonly elementCodenames: ${entityGenerators.elements.entityNames.codenamesTypeName};
                    readonly languageCodenames: ${entityGenerators.languages.entityNames.codenamesTypeName};
                    readonly taxonomyCodenames: ${entityGenerators.taxonomies.entityNames.codenamesTypeName};
                    readonly workflowCodenames: ${entityGenerators.workflows.entityNames.codenamesTypeName};
                    readonly workflowStepCodenames: ${entityGenerators.workflows.entityNames.allStepsNames.codenamesTypeName};
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
