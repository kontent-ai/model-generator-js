import { PropertyNameResolver } from '@kentico/kontent-delivery';
import { Options } from 'prettier';

export type PropertyNameResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export type SdkType = 'delivery' | 'management';

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    sdkType: SdkType;

    secureAccessKey?: string;
    nameResolver?: PropertyNameResolverType;
    formatOptions?: Options;
    customNameResolver?: PropertyNameResolver;
}
