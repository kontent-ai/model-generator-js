import { PropertyNameResolver } from '@kentico/kontent-delivery';
import { ContentTypeModels, TaxonomyModels } from '@kentico/kontent-management';
import { Options } from 'prettier';

export type DefaultResolverType = 'camelCase' | 'pascalCase' | 'snakeCase';

export type SdkType = 'delivery' | 'management';

export type ElementResolver = DefaultResolverType | PropertyNameResolver;

export type ContentTypeFileNameResolver = DefaultResolverType | ((contentType: ContentTypeModels.ContentType) => string);
export type TaxonomyTypeFileNameResolver = DefaultResolverType | ((taxonomy: TaxonomyModels.Taxonomy) => string);

export type ContentTypeResolver = DefaultResolverType | ((contentType: ContentTypeModels.ContentType) => string);
export type TaxonomyTypeResolver = DefaultResolverType | ((taxonomy: TaxonomyModels.Taxonomy) => string);

export interface IExportProjectSettings {
    exportWebhooks: boolean;
    exportWorkflows: boolean;
    exportRoles: boolean;
    exportAssetFolders: boolean;
    exportCollections: boolean;
    exportLanguages: boolean;
}

export interface IGenerateModelsConfig {
    projectId: string;
    addTimestamp: boolean;
    sdkType: SdkType;
    apiKey: string;

    exportProjectSettings: IExportProjectSettings;

    contentTypeFileResolver?: ContentTypeFileNameResolver;
    taxonomyTypeFileResolver?: TaxonomyTypeFileNameResolver;
    contentTypeResolver?: ContentTypeResolver;
    taxonomyTypeResolver?: TaxonomyTypeResolver;
    elementResolver?: ElementResolver;
    formatOptions?: Options;
}
