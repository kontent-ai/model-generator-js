import { IContentType, PropertyNameResolver } from '@kentico/kontent-delivery';
import { Options } from 'prettier';

export type DefaultResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export type SdkType = 'delivery' | 'management';

export type ElementResolver = DefaultResolverType | PropertyNameResolver;

export type FileNameResolver = DefaultResolverType | ((contentType: IContentType) => string);

export type ContentTypeResolver = DefaultResolverType | ((contentType: IContentType) => string);

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    sdkType: SdkType;

    secureAccessKey?: string;
    fileResolver?: FileNameResolver;
    contentTypeResolver?: ContentTypeResolver;
    elementResolver?: ElementResolver;
    formatOptions?: Options;
}
