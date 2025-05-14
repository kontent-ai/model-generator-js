import type { CollectionModels, ContentTypeSnippetModels, LanguageModels } from '@kontent-ai/management-sdk';
import { ContentTypeModels, TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { deliveryConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, GeneratedTypeModel, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined } from '../../core/core.utils.js';
import { getImporter } from '../../core/importer.js';
import type { DeliveryEntityName } from './delivery-entity-name.generator.js';
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

export type DeliveryEntityGeneratorConfig = {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly entityType: DeliveryEntityType;
    readonly entities: readonly Readonly<DeliveryEntity>[];
    readonly generateOnlyCoreFile: boolean;
    readonly deliveryGeneratorConfig: DeliveryGeneratorConfig;
};

export type DeliveryEntityGenerator = {
    readonly entityType: DeliveryEntityType;
    readonly generateEntityTypes: () => GeneratedSet;
    readonly entityNames: DeliveryEntityName;
};

export function getDeliveryEntityGenerator(config: DeliveryEntityGeneratorConfig): DeliveryEntityGenerator {
    const importer = getImporter(config.moduleFileExtension);
    const deliveryUtils = deliveryEntityUtils();
    const entityNames = getDeliveryEntityNamesGenerator({
        ...config,
        entityType: config.entityType
    }).getEntityNames();

    const getEntityTypeGuardFunction = (entity: Readonly<DeliveryEntity>): string => {
        return deliveryUtils.getTypeGuardCode({
            codenameTypeName: entityNames.getCodenameTypeName(entity),
            typeGuardName: entityNames.getTypeGuardName(entity),
            entity
        });
    };

    const getEntityInfoComment = (entity: Readonly<DeliveryEntity>): string => {
        return `* Codename: ${entity.codename}`;
    };

    const getMainFileCode = (): string => {
        return `
            ${deliveryUtils.getCodeOfDeliveryEntity({
                codenames: config.entities.map((m) => m.codename),
                originalName: undefined,
                resolvedName: config.entityType,
                type: config.entityType,
                propertySuffix: 'Codenames',
                typeGuardSuffix: 'Codename'
            })}
            ${getMainFileExtraCode()}`;
    };

    const getEntityCode = (entity: Readonly<DeliveryEntity>): string => {
        const extraCode = getEntityExtraCode(entity, entityNames.getNameWithoutSuffix(entity));

        return `
            ${importer.importType({
                filePathOrPackage: `./${entityNames.mainEntityFilename}`,
                importValue: `${entityNames.entityCodenamesTypeName}`
            })}${extraCode?.imports?.length ? `\n${extraCode.imports.join('\n')}` : ''}
           
    
            ${wrapComment(`
                * Type representing codename of ${entity.name}
                * 
                ${getEntityInfoComment(entity)}
                `)}
            export type ${entityNames.getCodenameTypeName(entity)} = Extract<${entityNames.entityCodenamesTypeName}, '${entity.codename}'>;

            ${wrapComment(`
                * Type guard for ${entity.name}
                * 
                ${getEntityInfoComment(entity)}
            `)}
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
            filename: entityNames.mainEntityFilename,
            text: getMainFileCode()
        };
    };

    const getMainFileExtraCode = (): string => {
        return match(config.entityType)
            .returnType<string>()
            .with('Workflow', () => {
                const workflowStepCodenames: readonly string[] = config.entities
                    .filter((m) => m instanceof WorkflowModels.Workflow)
                    .flatMap((workflow) =>
                        [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined)
                    )
                    .map((m) => m.codename);

                return deliveryUtils.getCodeOfDeliveryEntity({
                    codenames: workflowStepCodenames,
                    originalName: 'Workflow',
                    resolvedName: 'Workflow',
                    type: 'workflow step',
                    propertySuffix: 'StepCodenames',
                    typeGuardSuffix: 'StepCodename'
                });
            })
            .otherwise(() => '');
    };

    const getEntityExtraCode = (entity: DeliveryEntity, resolvedName: string): GeneratedTypeModel | undefined => {
        return match(entity)
            .returnType<GeneratedTypeModel | undefined>()
            .with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
                return {
                    imports: [],
                    code: deliveryUtils.getCodeOfDeliveryEntity({
                        codenames: [
                            ...workflow.steps.map((m) => m.codename),
                            workflow.publishedStep?.codename,
                            workflow.archivedStep?.codename,
                            workflow.scheduledStep?.codename
                        ].filter(isNotUndefined),
                        originalName: workflow.name,
                        resolvedName: resolvedName,
                        type: 'workflow step',
                        propertySuffix: 'StepCodenames',
                        typeGuardSuffix: 'StepCodename'
                    })
                };
            })
            .with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
                return {
                    imports: [],
                    code: deliveryUtils.getCodeOfDeliveryEntity({
                        codenames: deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms),
                        originalName: taxonomy.name,
                        resolvedName: resolvedName,
                        type: 'taxonomy term',
                        propertySuffix: deliveryConfig.taxonomyTermCodenamesSuffix,
                        typeGuardSuffix: 'TermCodename'
                    })
                };
            })
            .with(P.instanceOf(ContentTypeModels.ContentType), (contentType) =>
                getDeliveryTypeAndSnippetGenerator(config.deliveryGeneratorConfig).generateTypeModel(contentType)
            )
            .otherwise(() => undefined);
    };

    return {
        entityNames,
        entityType: config.entityType,
        generateEntityTypes: (): GeneratedSet => {
            return {
                folderName: entityNames.entityFolderName,
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
