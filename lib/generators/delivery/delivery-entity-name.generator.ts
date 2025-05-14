import type { TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { mapFilename, mapName, resolveCase, type FilenameResolver, type NameResolver } from '../../core/resolvers.js';
import type { DeliveryEntity, DeliveryEntityType } from './delivery-entity.generator.js';
import type { DeliveryGeneratorConfig } from './delivery.generator.js';
import { deliveryEntityUtils } from './utils/delivery-entity.utils.js';

export type DeliveryEntityNames<T extends DeliveryEntityType> = {
    readonly codenamesValuePropertyName: string;
    readonly codenamesTypeName: string;
    readonly codenamesTypeguardFunctionName: string;

    readonly mainFilename: string;
    readonly folderName: string;

    readonly getEntityName: (entity: Readonly<DeliveryEntity>) => string;
    readonly getEntityFilename: (entity: Readonly<DeliveryEntity>, addExtension: boolean) => string;
    readonly getCodenameTypeName: (entity: Readonly<DeliveryEntity>) => string;
    readonly getTypeguardFunctionName: (entity: Readonly<DeliveryEntity>) => string;
} & AdditionalEntityNames<T>;

export type AdditionalEntityNames<T> = T extends 'Taxonomy'
    ? {
          readonly termsNames: {
              readonly valuesPropertyName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
              readonly codenamesTypeName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
              readonly typeguardFunctionName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
          };
      }
    : T extends 'Workflow'
      ? {
            readonly allStepsNames: {
                readonly valuesPropertyName: string;
                readonly codenamesTypeName: string;
                readonly typeguardFunctionName: string;
            };
            readonly stepsNames: {
                readonly valuesPropertyName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
                readonly codenamesTypeName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
                readonly typeguardFunctionName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
            };
        }
      : NonNullable<unknown>;

export function getDeliveryEntityNamesGenerator<T extends DeliveryEntityType>(
    config: Pick<DeliveryGeneratorConfig, 'nameResolvers' | 'fileResolvers'> & { readonly entityType: T }
) {
    const deliveryUtils = deliveryEntityUtils();

    return {
        getEntityNames: (): DeliveryEntityNames<T> => {
            const { filenameResolver, nameResolver } = match<DeliveryEntityType>(config.entityType)
                .returnType<{
                    readonly nameResolver: NameResolver<DeliveryEntity> | undefined;
                    readonly filenameResolver: FilenameResolver<DeliveryEntity> | undefined;
                }>()
                .with('Type', () => ({
                    nameResolver: config.nameResolvers?.contentType
                        ? (config.nameResolvers.contentType as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.contentType
                        ? (config.fileResolvers.contentType as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Snippet', () => ({
                    nameResolver: config.nameResolvers?.snippet
                        ? (config.nameResolvers.snippet as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.snippet
                        ? (config.fileResolvers.snippet as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Taxonomy', () => ({
                    nameResolver: config.nameResolvers?.taxonomy
                        ? (config.nameResolvers.taxonomy as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.taxonomy
                        ? (config.fileResolvers.taxonomy as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Language', () => ({
                    nameResolver: config.nameResolvers?.language
                        ? (config.nameResolvers.language as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.language
                        ? (config.fileResolvers.language as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Workflow', () => ({
                    nameResolver: config.nameResolvers?.workflow
                        ? (config.nameResolvers.workflow as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.workflow
                        ? (config.fileResolvers.workflow as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Collection', () => ({
                    nameResolver: config.nameResolvers?.collection
                        ? (config.nameResolvers.collection as NameResolver<DeliveryEntity>)
                        : undefined,
                    filenameResolver: config.fileResolvers?.collection
                        ? (config.fileResolvers.collection as FilenameResolver<DeliveryEntity>)
                        : undefined
                }))
                .with('Element', () => ({
                    nameResolver: (item) => item.codename,
                    filenameResolver: (item) => item.codename
                }))
                .exhaustive();

            const entityNames: DeliveryEntityNames<DeliveryEntityType> = {
                codenamesTypeName: `${resolveCase(config.entityType, 'pascalCase')}Codenames`,
                codenamesValuePropertyName: `${resolveCase(config.entityType, 'camelCase')}Codenames`,
                codenamesTypeguardFunctionName: `is${resolveCase(config.entityType, 'pascalCase')}Codename`,
                mainFilename: mapFilename(undefined, {
                    prefix: '_'
                })({ codename: resolveCase(deliveryUtils.getPluralName(config.entityType), 'camelCase') }, true),
                folderName: resolveCase(deliveryUtils.getPluralName(config.entityType), 'camelCase'),

                getEntityName: mapName(nameResolver, 'pascalCase', { suffix: `${config.entityType}` }),
                getCodenameTypeName: mapName(nameResolver, 'pascalCase', { suffix: `${config.entityType}Codename` }),
                getTypeguardFunctionName: mapName(nameResolver, 'pascalCase', {
                    prefix: 'is',
                    suffix: `${config.entityType}Codename`
                }),
                getEntityFilename: mapFilename(filenameResolver, {
                    suffix: `.${resolveCase(config.entityType, 'camelCase')}`
                }),
                termsNames:
                    config.entityType === 'Taxonomy'
                        ? {
                              valuesPropertyName: mapName(undefined, 'camelCase', { suffix: `TermCodenames` }),
                              codenamesTypeName: mapName(undefined, 'pascalCase', { suffix: `TermCodenames` }),
                              typeguardFunctionName: mapName(undefined, 'pascalCase', { prefix: 'is', suffix: `TermCodename` })
                          }
                        : undefined,
                stepsNames:
                    config.entityType === 'Workflow'
                        ? {
                              valuesPropertyName: mapName(undefined, 'camelCase', { suffix: `StepCodenames` }),
                              codenamesTypeName: mapName(undefined, 'pascalCase', { suffix: `StepCodenames` }),
                              typeguardFunctionName: mapName(undefined, 'pascalCase', { prefix: 'is', suffix: `StepCodename` })
                          }
                        : undefined,
                allStepsNames:
                    config.entityType === 'Workflow'
                        ? {
                              valuesPropertyName: resolveCase('workflowStepCodenames', 'camelCase'),
                              codenamesTypeName: resolveCase('workflowStepCodenames', 'pascalCase'),
                              typeguardFunctionName: resolveCase('isWorkflowStepCodename', 'camelCase')
                          }
                        : undefined
            };

            return entityNames as DeliveryEntityNames<T>;
        }
    };
}
