import {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    ElementModels,
    IManagementClient,
    TaxonomyModels
} from '@kontent-ai/management-sdk';
import { PropertyNameResolver } from '@kontent-ai/delivery-sdk';

export type CliAction = 'delivery' | 'migration';
export type LibraryType = '@kontent-ai/migration-toolkit' | '@kontent-ai/delivery-sdk';
export type ModuleResolution = 'nodeNext' | 'node';
export type CaseType = 'camelCase' | 'pascalCase' | 'snakeCase';
export type ModelType = 'delivery' | 'migration';
export type GeneratorElementResolver = CaseType | PropertyNameResolver;
export type GeneratorManagementClient = Readonly<IManagementClient<unknown>>;
export type LiteralUnion<T extends string> = T | (string & NonNullable<unknown>);

export interface ErrorData {
    readonly message: string;
    readonly requestData?: string;
    readonly requestUrl?: string;
    readonly isUnknownError: boolean;
    readonly error: unknown;
}

export interface OriginalManagementError {
    readonly response?: {
        readonly status?: number;
        readonly config?: {
            readonly url?: string;
            readonly data?: string;
        };
        readonly data?: {
            readonly error_code?: number;
        };
    };
}

export interface FlattenedElement {
    readonly title: string;
    readonly id: string;
    readonly codename: string;
    readonly externalId?: string;
    readonly type: ElementModels.ElementType;
    readonly isRequired: boolean;
    readonly guidelines?: string;
    readonly allowedContentTypes?: readonly Readonly<ContentTypeModels.ContentType>[];
    readonly originalElement: Readonly<ContentTypeElements.ContentTypeElementModel>;
    readonly assignedTaxonomy?: Readonly<TaxonomyModels.Taxonomy>;
    readonly fromSnippet?: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
}

export interface GeneratedFile {
    readonly filename: string;
    readonly text: string;
}
