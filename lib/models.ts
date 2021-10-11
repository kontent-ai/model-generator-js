import { PropertyNameResolver } from '@kentico/kontent-delivery';
import { Options } from 'prettier';

export type PropertyNameResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    secureAccessKey?: string;
    nameResolver?: PropertyNameResolverType;
    formatOptions?: Options;
    customNameResolver?: PropertyNameResolver;
}
