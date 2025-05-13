import { match } from 'ts-pattern';
import { deliveryConfig } from '../../config.js';
import { mapFilename, mapName, resolveCase, type FilenameResolver, type NameResolver } from '../../core/resolvers.js';
import type { DeliveryEntity, DeliveryEntityType } from './delivery-entity.generator.js';
import type { DeliveryGeneratorConfig } from './delivery.generator.js';
import { deliveryEntityUtils } from './utils/delivery-entity.utils.js';

export type DeliveryEntityName = {
    readonly entityCodenamesTypeName: string;
    readonly mainEntityFilename: string;
    readonly entityFolderName: string;

    readonly getEntityName: (entity: Readonly<DeliveryEntity>) => string;
    readonly getEntityFilename: (entity: Readonly<DeliveryEntity>, addExtension: boolean) => string;
    readonly getCodenameTypeName: (entity: Readonly<DeliveryEntity>) => string;
    readonly getTypeGuardName: (entity: Readonly<DeliveryEntity>) => string;
    readonly getNameWithoutSuffix: (entity: Readonly<DeliveryEntity>) => string;
    readonly taxonomyTermCodenamesTypeName: (entity: Readonly<DeliveryEntity>) => string;
};

export function getDeliveryEntityNamesGenerator(
    config: Pick<DeliveryGeneratorConfig, 'nameResolvers' | 'fileResolvers'> & { readonly entityType: DeliveryEntityType }
) {
    const deliveryUtils = deliveryEntityUtils();

    return {
        getEntityNames: (): DeliveryEntityName => {
            const { filenameResolver, nameResolver } = match(config.entityType)
                .returnType<{
                    readonly nameResolver: NameResolver<DeliveryEntity> | undefined;
                    readonly filenameResolver: FilenameResolver<DeliveryEntity> | undefined;
                }>()
                .with('ContentType', () => ({
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
                    nameResolver: 'pascalCase',
                    filenameResolver: 'camelCase'
                }))
                .exhaustive();

            return {
                taxonomyTermCodenamesTypeName: match(config.entityType)
                    .with('Taxonomy', () => mapName(nameResolver, 'pascalCase', { suffix: deliveryConfig.taxonomyTermCodenamesSuffix }))
                    .otherwise(() => {
                        return () => {
                            throw new Error(`Cannot resolve taxonomy terms for entity type '${config.entityType}'`);
                        };
                    }),
                entityCodenamesTypeName: `${config.entityType}Codenames`,
                mainEntityFilename: mapFilename('camelCase', {
                    prefix: '_'
                })({ codename: `${deliveryUtils.getPluralName(config.entityType)}` }, true),
                entityFolderName: `${resolveCase(deliveryUtils.getPluralName(config.entityType), 'camelCase')}`,

                getEntityName: mapName(nameResolver, 'pascalCase', { suffix: `${config.entityType}` }),
                getCodenameTypeName: mapName(nameResolver, 'pascalCase', { suffix: `${config.entityType}Codename` }),
                getTypeGuardName: mapName(nameResolver, 'pascalCase', {
                    prefix: 'is',
                    suffix: `${config.entityType}Codename`
                }),
                getNameWithoutSuffix: mapName(nameResolver, 'pascalCase', { suffix: `${config.entityType}` }),
                getEntityFilename: mapFilename(filenameResolver, {
                    suffix: `.${resolveCase(config.entityType, 'camelCase')}`
                })
            };
        }
    };
}
