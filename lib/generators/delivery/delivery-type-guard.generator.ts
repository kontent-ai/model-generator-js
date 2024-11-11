import { ContentTypeModels } from '@kontent-ai/management-sdk';
import { deliveryConfig } from '../../config.js';
import { ContentTypeNameResolver, mapName } from '../../core/resolvers.js';

export interface DeliveryTypeGuardGeneratorConfig {
    readonly nameResolvers?: {
        readonly contentType?: ContentTypeNameResolver;
    };
}

export function deliveryTypeGuardGenerator(config: DeliveryTypeGuardGeneratorConfig) {
    const nameResolvers = {
        typeGuardFunctionName: mapName(config.nameResolvers?.contentType, 'pascalCase', {
            prefix: 'is'
        }),
        typeName: mapName(config.nameResolvers?.contentType, 'pascalCase')
    };

    const getTypeGuardFunction = (contentType: Readonly<ContentTypeModels.ContentType>): string => {
        return `export function ${nameResolvers.typeGuardFunctionName(contentType)}(item: ${deliveryConfig.coreContentTypeName} | undefined | null): item is ${nameResolvers.typeName(contentType)} {
            return item?.system?.type === '${contentType.codename}';
        }`;
    };

    return {
        getTypeGuardFunction
    };
}
