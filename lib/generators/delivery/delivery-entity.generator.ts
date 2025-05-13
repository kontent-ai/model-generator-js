import type { CollectionModels, ContentTypeModels, LanguageModels } from '@kontent-ai/management-sdk';
import { TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { deliveryConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined } from '../../core/core.utils.js';
import { getImporter } from '../../core/importer.js';
import type { FilenameResolver, MapObjectToName, NameResolver } from '../../core/resolvers.js';
import { mapFilename, mapName, resolveCase } from '../../core/resolvers.js';
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
    | Readonly<ContentTypeModels.ContentType>;

export type DeliveryEntityType = 'Language' | 'Collection' | 'Workflow' | 'Taxonomy' | 'ContentType' | 'Element';

export type DeliveryEntityGeneratorConfig<TEntity extends DeliveryEntity> = {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly entityType: DeliveryEntityType;
    readonly entities: readonly Readonly<TEntity>[];
    readonly fileResolver: FilenameResolver<Readonly<TEntity>>;
    readonly nameResolver: NameResolver<Readonly<TEntity>>;
    readonly generateOnlyCoreFile: boolean;
};

export type DeliveryEntityGenerator<TEntity extends DeliveryEntity> = {
    readonly entityType: DeliveryEntityType;
    readonly mainEntityFilename: string;
    readonly entityFolderName: string;
    readonly entityCodenamesTypeName: string;
    readonly generateEntityTypes: () => GeneratedSet;
    readonly getEntityName: MapObjectToName<TEntity>;
};

export function getDeliveryEntityGenerator<TEntity extends DeliveryEntity>(
    config: DeliveryEntityGeneratorConfig<TEntity>
): DeliveryEntityGenerator<TEntity> {
    const importer = getImporter(config.moduleFileExtension);
    const deliveryUtils = deliveryEntityUtils();

    const resolvedNames = {
        entityCodenamesTypeName: `${config.entityType}Codenames`,
        mainEntityFilename: mapFilename('camelCase', {
            prefix: '_'
        })({ codename: `${deliveryUtils.getPluralName(config.entityType)}` }, true),
        entityFolderName: `${resolveCase(deliveryUtils.getPluralName(config.entityType), 'camelCase')}`
    };

    const nameResolvers = {
        getEntityName: mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}` }),
        getCodenameTypeName: mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}Codename` }),
        getTypeGuardName: mapName(config.nameResolver, 'pascalCase', {
            prefix: 'is',
            suffix: `${config.entityType}Codename`
        })
    };

    const getEntityTypeGuardFunction = (entity: Readonly<TEntity>): string => {
        return deliveryUtils.getTypeGuardCode({
            codenameTypeName: nameResolvers.getCodenameTypeName(entity),
            typeGuardName: nameResolvers.getTypeGuardName(entity),
            entity
        });
    };

    const getEntityInfoComment = (entity: Readonly<TEntity>): string => {
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

    const getEntityCode = (entity: Readonly<TEntity>): string => {
        const nameMapWithoutSuffix = mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}` });

        return `
            ${importer.importType({
                filePathOrPackage: `./${resolvedNames.mainEntityFilename}`,
                importValue: `${resolvedNames.entityCodenamesTypeName}`
            })}
    
            ${wrapComment(`
                * Type representing codename of ${entity.name}
                * 
                ${getEntityInfoComment(entity)}
                `)}
            export type ${nameResolvers.getCodenameTypeName(entity)} = Extract<${resolvedNames.entityCodenamesTypeName}, '${entity.codename}'>;

            ${wrapComment(`
                * Type guard for ${entity.name}
                * 
                ${getEntityInfoComment(entity)}
            `)}
            ${getEntityTypeGuardFunction(entity)}
            ${getEntityExtraCode(entity, nameMapWithoutSuffix(entity))}
            `;
    };

    const getEntityFile = (entity: Readonly<TEntity>): GeneratedFile => {
        const filenameMap = mapFilename(config.fileResolver, {
            suffix: `.${resolveCase(config.entityType, 'camelCase')}`
        });

        return {
            filename: filenameMap(entity, true),
            text: getEntityCode(entity)
        };
    };

    const getMainEntityFile = (): GeneratedFile => {
        return {
            filename: resolvedNames.mainEntityFilename,
            text: getMainFileCode()
        };
    };

    const getMainFileExtraCode = (): string => {
        return match(config.entityType)
            .returnType<string>()
            .with('Workflow', () => {
                const workflowSteps: readonly string[] = config.entities
                    .filter((m) => m instanceof WorkflowModels.Workflow)
                    .flatMap((workflow) =>
                        [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined)
                    )
                    .map((m) => m.codename);

                return deliveryUtils.getCodeOfDeliveryEntity({
                    codenames: workflowSteps,
                    originalName: 'Workflow',
                    resolvedName: 'Workflow',
                    type: 'workflow step',
                    propertySuffix: 'StepCodenames',
                    typeGuardSuffix: 'StepCodename'
                });
            })
            .otherwise(() => '');
    };

    const getEntityExtraCode = (entity: DeliveryEntity, resolvedName: string): string => {
        return match(entity)
            .returnType<string>()
            .with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
                return deliveryUtils.getCodeOfDeliveryEntity({
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
                });
            })
            .with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
                return deliveryUtils.getCodeOfDeliveryEntity({
                    codenames: deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms),
                    originalName: taxonomy.name,
                    resolvedName: resolvedName,
                    type: 'taxonomy term',
                    propertySuffix: deliveryConfig.taxonomyTermCodenamesSuffix,
                    typeGuardSuffix: 'TermCodename'
                });
            })
            .otherwise(() => '');
    };

    return {
        mainEntityFilename: resolvedNames.mainEntityFilename,
        entityFolderName: resolvedNames.entityFolderName,
        getEntityName: nameResolvers.getEntityName,
        entityType: config.entityType,
        entityCodenamesTypeName: resolvedNames.entityCodenamesTypeName,
        generateEntityTypes: (): GeneratedSet => {
            return {
                folderName: resolvedNames.entityFolderName,
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
