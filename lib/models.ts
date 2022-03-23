import { IContentType, ITaxonomyGroup, PropertyNameResolver } from '@kentico/kontent-delivery';
import { Options } from 'prettier';

export type DefaultResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export type SdkType = 'delivery' | 'management';

export type ElementResolver = DefaultResolverType | PropertyNameResolver;

export type ContentTypeFileNameResolver = DefaultResolverType | ((contentType: IContentType) => string);
export type TaxonomyTypeFileNameResolver = DefaultResolverType | ((taxonomy: ITaxonomyGroup) => string);

export type ContentTypeResolver = DefaultResolverType | ((contentType: IContentType) => string);
export type TaxonomyTypeResolver = DefaultResolverType | ((taxonomy: ITaxonomyGroup) => string);

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    sdkType: SdkType;

    secureAccessKey?: string;
    contentTypeFileResolver?: ContentTypeFileNameResolver;
    taxonomyTypeFileResolver?: TaxonomyTypeFileNameResolver;
    contentTypeResolver?: ContentTypeResolver;
    taxonomyTypeResolver?: TaxonomyTypeResolver;
    elementResolver?: ElementResolver;
    formatOptions?: Options;
}
