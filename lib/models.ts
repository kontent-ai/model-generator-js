import { PropertyNameResolver } from '@kontent-ai/delivery-sdk';
import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { Options } from 'prettier';

export type ModuleResolution = 'nodeNext' | 'node';
export type DefaultResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';
export type ModelType = 'delivery' | 'migration';
export type ElementResolver = DefaultResolverType | PropertyNameResolver;

export type ContentTypeFileNameResolver =
    | DefaultResolverType
    | ((contentType: Readonly<ContentTypeModels.ContentType>) => string);
export type ContentTypeSnippetFileNameResolver =
    | DefaultResolverType
    | ((contentTypeSnippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>) => string);
export type TaxonomyTypeFileNameResolver =
    | DefaultResolverType
    | ((taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string);

export type ContentTypeResolver =
    | DefaultResolverType
    | ((contentType: Readonly<ContentTypeModels.ContentType>) => string);
export type ContentTypeSnippetResolver =
    | DefaultResolverType
    | ((contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet) => string);
export type TaxonomyTypeResolver = DefaultResolverType | ((taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string);

export interface GenerateDeliveryModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly addEnvironmentInfo: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly contentTypeFileResolver?: ContentTypeFileNameResolver;
    readonly contentTypeSnippetFileResolver?: ContentTypeSnippetFileNameResolver;
    readonly taxonomyTypeFileResolver?: TaxonomyTypeFileNameResolver;
    readonly contentTypeResolver?: ContentTypeResolver;
    readonly contentTypeSnippetResolver?: ContentTypeSnippetResolver;
    readonly taxonomyTypeResolver?: TaxonomyTypeResolver;
    readonly elementResolver?: ElementResolver;
    readonly formatOptions?: Options;
}

export interface GeneratProjectModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly isEnterpriseSubscription: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly formatOptions?: Options;
}

export interface GenerateMigrationModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleResolution: ModuleResolution;
    readonly outputDir: string;

    readonly baseUrl?: string;
    readonly formatOptions?: Options;
}
