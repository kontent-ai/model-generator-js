import type { CollectionModels, LanguageModels } from '@kontent-ai/management-sdk';
import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, GeneratedTypeModel, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined } from '../../core/core.utils.js';
import { getImporter } from '../../core/importer.js';
import type { DeliveryEntityNames } from './delivery-entity-name.generator.js';
import { getDeliveryEntityNamesGenerator } from './delivery-entity-name.generator.js';
import { getDeliveryTypeAndSnippetGenerator } from './delivery-type-and-snippet.generator.js';
import type { DeliveryGeneratorConfig } from './delivery.generator.js';
import { deliveryEntityUtils } from './utils/delivery-entity.utils.js';

export type DeliveryElement = {
    readonly codename: string;
    readonly name: string;
};

export type DeliveryEntity =
    | Readonly<LanguageModels.LanguageModel>
    | Readonly<CollectionModels.Collection>
    | Readonly<WorkflowModels.Workflow>
    | Readonly<TaxonomyModels.Taxonomy>
    | DeliveryElement
    | Readonly<ContentTypeModels.ContentType>
    | Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;

export type DeliveryEntityType = 'Language' | 'Collection' | 'Workflow' | 'Taxonomy' | 'Type' | 'Element' | 'Snippet';

export type DeliveryEntityGeneratorConfig<T extends DeliveryEntityType> = {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly entityType: T;
    readonly entities: readonly Readonly<DeliveryEntity>[];
    readonly generateOnlyCoreFile: boolean;
    readonly deliveryGeneratorConfig: DeliveryGeneratorConfig;
};

export type DeliveryEntityGenerator<T extends DeliveryEntityType> = {
    readonly entityType: T;
    readonly generateEntityTypes: () => GeneratedSet;
    readonly entityNames: DeliveryEntityNames<T>;
};

export function getDeliveryEntityGenerator<T extends DeliveryEntityType>(
    config: DeliveryEntityGeneratorConfig<T>
): DeliveryEntityGenerator<T> {
    const importer = getImporter(config.moduleFileExtension);
    const deliveryUtils = deliveryEntityUtils();
    const entityNames = getDeliveryEntityNamesGenerator({
        ...{
            nameResolvers: config.deliveryGeneratorConfig.nameResolvers,
            fileResolvers: config.deliveryGeneratorConfig.fileResolvers
        },
        entityType: config.entityType
    }).getEntityNames();

    const getEntityTypeGuardFunction = (entity: Readonly<DeliveryEntity>): string => {
        return deliveryUtils.getTypeGuardCode({
            codenameTypeName: entityNames.getCodenameTypeName(entity),
            typeGuardName: entityNames.getTypeguardFunctionName(entity),
            entity
        });
    };

    const getMainFileCode = (): string => {
        return `
            ${deliveryUtils.getCodeOfDeliveryEntity({
                codenames: config.entities.map((m) => m.codename),
                entityName: undefined,
                names: {
                    codenamesTypeName: entityNames.codenamesTypeName,
                    typeGuardFunctionName: entityNames.codenamesTypeguardFunctionName,
                    valuesPropertyName: entityNames.codenamesValuePropertyName
                },
                extendedType: config.entityType
            })}
            ${getMainFileExtraCode()}`;
    };

    const getEntityCode = (entity: Readonly<DeliveryEntity>): string => {
        const extraCode = getEntityExtraCode(entity);

        const getEntityComment: (title: string) => string = (title) => {
            return wrapComment(title, {
                lines: [
                    {
                        name: 'Name',
                        value: entity.name
                    },
                    {
                        name: 'Codename',
                        value: entity.codename
                    },
                    {
                        name: 'Type',
                        value: config.entityType
                    }
                ]
            });
        };

        return `
            ${importer.importType({
                filePathOrPackage: `./${entityNames.mainFilename}`,
                importValue: `${entityNames.codenamesTypeName}`
            })}${extraCode?.imports?.length ? `\n${extraCode.imports.join('\n')}` : ''}
           
            ${getEntityComment(`Type representing codename of entity`)}
            export type ${entityNames.getCodenameTypeName(entity)} = Extract<${entityNames.codenamesTypeName}, '${entity.codename}'>;

            ${getEntityComment(`Typeguard function for entity`)}
            ${getEntityTypeGuardFunction(entity)}${extraCode ? `\n${extraCode.code}` : ''}
            `;
    };

    const getEntityFile = (entity: Readonly<DeliveryEntity>): GeneratedFile => {
        return {
            filename: entityNames.getEntityFilename(entity, true),
            text: getEntityCode(entity)
        };
    };

    const getMainEntityFile = (): GeneratedFile => {
        return {
            filename: entityNames.mainFilename,
            text: getMainFileCode()
        };
    };

    const getMainFileExtraCode = (): string => {
        return match<DeliveryEntityType>(config.entityType)
            .returnType<string>()
            .with('Workflow', () => {
                const workflowStepCodenames: readonly string[] = config.entities
                    .filter((m) => m instanceof WorkflowModels.Workflow)
                    .flatMap((workflow) =>
                        [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined)
                    )
                    .map((m) => m.codename);

                const worfklowStepNames = getDeliveryEntityNamesGenerator({
                    ...{
                        nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
                        fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined
                    },
                    entityType: 'Workflow'
                }).getEntityNames();

                return deliveryUtils.getCodeOfDeliveryEntity({
                    codenames: workflowStepCodenames,
                    names: {
                        codenamesTypeName: worfklowStepNames.allStepsNames.codenamesTypeName,
                        typeGuardFunctionName: worfklowStepNames.allStepsNames.typeguardFunctionName,
                        valuesPropertyName: worfklowStepNames.allStepsNames.valuesPropertyName
                    },
                    entityName: undefined,
                    extendedType: 'Workflow'
                });
            })
            .otherwise(() => '');
    };

    const getEntityExtraCode = (entity: DeliveryEntity): GeneratedTypeModel | undefined => {
        return match(entity)
            .returnType<GeneratedTypeModel | undefined>()
            .with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
                const worfklowStepNames = getDeliveryEntityNamesGenerator({
                    ...{
                        nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
                        fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined
                    },
                    entityType: 'Workflow'
                }).getEntityNames();

                return {
                    imports: [],
                    code: deliveryUtils.getCodeOfDeliveryEntity({
                        codenames: [
                            ...workflow.steps.map((m) => m.codename),
                            workflow.publishedStep?.codename,
                            workflow.archivedStep?.codename,
                            workflow.scheduledStep?.codename
                        ].filter(isNotUndefined),
                        entityName: workflow.name,
                        names: {
                            codenamesTypeName: worfklowStepNames.stepsNames.codenamesTypeName(workflow),
                            typeGuardFunctionName: worfklowStepNames.stepsNames.typeguardFunctionName(workflow),
                            valuesPropertyName: worfklowStepNames.stepsNames.valuesPropertyName(workflow)
                        },
                        extendedType: 'Workflow step'
                    })
                };
            })
            .with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
                const termEntityNames = getDeliveryEntityNamesGenerator({
                    ...{
                        nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
                        fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined
                    },
                    entityType: 'Taxonomy'
                }).getEntityNames();

                return {
                    imports: [],
                    code: deliveryUtils.getCodeOfDeliveryEntity({
                        codenames: deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms),
                        entityName: taxonomy.name,
                        names: {
                            codenamesTypeName: termEntityNames.termsNames.codenamesTypeName(taxonomy),
                            typeGuardFunctionName: termEntityNames.termsNames.typeguardFunctionName(taxonomy),
                            valuesPropertyName: termEntityNames.termsNames.valuesPropertyName(taxonomy)
                        },
                        extendedType: 'Taxonomy term'
                    })
                };
            })
            .with(P.instanceOf(ContentTypeModels.ContentType), (contentType) =>
                getDeliveryTypeAndSnippetGenerator(config.deliveryGeneratorConfig).generateTypeModel(contentType)
            )
            .with(P.instanceOf(ContentTypeSnippetModels.ContentTypeSnippet), (contentTypeSnippet) =>
                getDeliveryTypeAndSnippetGenerator(config.deliveryGeneratorConfig).generateSnippetModel(contentTypeSnippet)
            )
            .otherwise(() => undefined);
    };

    return {
        entityNames,
        entityType: config.entityType,
        generateEntityTypes: (): GeneratedSet => {
            return {
                folderName: entityNames.folderName,
                files: [
                    ...(config.generateOnlyCoreFile
                        ? []
                        : config.entities.map<GeneratedFile>((entity) => {
                              return getEntityFile(entity);
                          })),
                    getMainEntityFile()
                ]
            };
        }
    };
}
