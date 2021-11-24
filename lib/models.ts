import { PropertyNameResolver } from '@kentico/kontent-delivery';
import { Options } from 'prettier';

export type PropertyNameResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export type SdkType = 'delivery' | 'management';

export type ElementResolver = PropertyNameResolverType | PropertyNameResolver;

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    sdkType: SdkType;

    secureAccessKey?: string;
    elementResolver?: ElementResolver;
    formatOptions?: Options;
}
