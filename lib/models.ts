import { PropertyNameResolver } from '@kontent-ai/delivery-sdk';
import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { Options } from 'prettier';

export type ModuleResolution = 'nodeNext' | 'node';
export type DefaultResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';
export type ModelType = 'delivery' | 'migration';
export type ElementResolver = DefaultResolverType | PropertyNameResolver;

export type ContentTypeFileNameResolver =
    | DefaultResolverType
    | ((contentType: ContentTypeModels.ContentType) => string);
export type ContentTypeSnippetFileNameResolver =
    | DefaultResolverType
    | ((contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet) => string);
export type TaxonomyTypeFileNameResolver = DefaultResolverType | ((taxonomy: TaxonomyModels.Taxonomy) => string);

export type ContentTypeResolver = DefaultResolverType | ((contentType: ContentTypeModels.ContentType) => string);
export type ContentTypeSnippetResolver =
    | DefaultResolverType
    | ((contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet) => string);
export type TaxonomyTypeResolver = DefaultResolverType | ((taxonomy: TaxonomyModels.Taxonomy) => string);

export interface IGenerateDeliveryModelsConfig {
    environmentId: string;
    addTimestamp: boolean;
    addEnvironmentInfo: boolean;
    isEnterpriseSubscription: boolean;
    apiKey: string;
    moduleResolution?: ModuleResolution;
    managementApiUrl?: string;

    outputDir?: string;
    sortConfig?: ISortConfig;
    contentTypeFileResolver?: ContentTypeFileNameResolver;
    contentTypeSnippetFileResolver?: ContentTypeSnippetFileNameResolver;
    taxonomyTypeFileResolver?: TaxonomyTypeFileNameResolver;
    contentTypeResolver?: ContentTypeResolver;
    contentTypeSnippetResolver?: ContentTypeSnippetResolver;
    taxonomyTypeResolver?: TaxonomyTypeResolver;
    elementResolver?: ElementResolver;
    formatOptions?: Options;
}

export interface ISortConfig {
    sortTaxonomyTerms: boolean;
}

export interface GenerateMigrationModelsConfig {
    readonly addEnvironmentInfo: boolean;
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleResolution: ModuleResolution;
    readonly outputDir: string;
    readonly managementApiUrl?: string;
    readonly formatOptions?: Options;
}
