import type { IDeliveryClient } from '@kontent-ai/delivery-sdk';
import type {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    ElementModels,
    IManagementClient,
    TaxonomyModels
} from '@kontent-ai/management-sdk';

export type CliAction = 'delivery-sdk' | 'migration-toolkit' | 'environment' | 'items';
export type LibraryType = '@kontent-ai/migration-toolkit' | '@kontent-ai/delivery-sdk';

export const moduleFileExtensions = ['js', 'ts', 'mjs', 'mts', 'none'] as const;

export type ModuleFileExtension = (typeof moduleFileExtensions)[number];

export const environmentEntities = [
    'languages',
    'taxonomies',
    'contentTypes',
    'snippets',
    'webhooks',
    'collections',
    'workflows',
    'assetFolders',
    'roles',
    'customApps',
    'previewUrls',
    'spaces'
] as const;

export type EnvironmentEntity = (typeof environmentEntities)[number];

export type CaseType = 'camelCase' | 'pascalCase';
export type DeliveryApiMode = 'preview' | 'secure' | 'default';
export type GeneratorManagementClient = Readonly<IManagementClient<unknown>>;
export type GeneratorDeliveryClient = Readonly<IDeliveryClient>;
export type LiteralUnion<T extends string | undefined> = T | (string & NonNullable<unknown>);
export type CreateFilesConfig = { readonly createFiles: true; readonly outputDir?: string } | { readonly createFiles: false };

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ErrorData {
    readonly message: string;
    readonly isMapiError: boolean;
    readonly error: unknown;

    readonly requestData?: string;
    readonly requestUrl?: string;
    readonly isUnknownError: boolean;
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

export interface MultipleChoiceOption {
    readonly name: string;
    readonly codename: string;
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
    readonly multipleChoiceOptions?: readonly Readonly<MultipleChoiceOption>[];
    readonly isElementWithProperty: boolean;
}

export interface GeneratedFile {
    readonly filename: string;
    readonly text: string;
}

export interface GeneratedSet {
    readonly files: readonly GeneratedFile[];
    readonly folderName: string | undefined;
}

export type ObjectWithCodename = {
    readonly codename: string;
};

export type ObjectWithName = {
    readonly name: string;
};

export type ValidateKeys<Keys, T extends keyof T extends Keys ? (Keys extends keyof T ? unknown : never) : never> = T;

export type GeneratedTypeModel = {
    readonly imports: readonly string[];
    readonly code: string;
};
