import type { DeliveryApiMode, ModuleFileExtension } from './core/core.models.js';
import { libMetadata } from './meta/metadata.js';

export const defaultModuleFileExtension: ModuleFileExtension = 'js';
export const defaultDeliveryApiMode: DeliveryApiMode = 'default';

export const coreConfig = {
    barrelExportFilename: 'index.ts',
    kontentTrackingHeaderName: 'X-KC-SOURCE',
    kontentTrackingHeaderValue: `${libMetadata.name};${libMetadata.version}`
} as const;

export const sharedTypesConfig = {
    languageCodenames: 'LanguageCodenames',
    collectionCodenames: 'CollectionCodenames',
    workflowCodenames: 'WorkflowCodenames',
    workflowStepCodenames: 'WorkflowStepCodenames',
    contentTypeCodenames: 'ContentTypeCodenames',
    taxonomyCodenames: 'TaxonomyCodenames',
    elementCodenames: 'ElementCodenames'
} as const;

export const migrationConfig = {
    npmPackageName: '@kontent-ai/migration-toolkit',
    migrationItemsFolderName: `content-types`,
    environmentFolderName: `environment`,
    migrationTypesFilename: `migration`,
    environmentFilename: `environment`,

    sdkTypeNames: {
        system: 'MigrationItemSystem',
        item: 'MigrationItem',
        elements: 'MigrationElements',
        elementModels: 'MigrationElementModels'
    },

    localTypeNames: {
        system: 'CoreMigrationItemSystem',
        item: 'CoreMigrationItem',
        codename: 'TCodename',
        elements: 'TElements'
    }
} as const;

export const deliveryConfig = {
    npmPackageName: '@kontent-ai/delivery-sdk',
    contentTypesFolderName: `content-types`,
    contentTypeSnippetsFolderName: `content-type-snippets`,
    taxonomiesFolderName: `taxonomies`,
    typeGuardsFileName: 'delivery.type-guards',
    systemTypesFolderName: 'system',
    coreCodenamesFilename: 'delivery.codenames',
    coreTypeFilename: 'core.type',
    coreContentTypeName: 'CoreContentType',
    coreDeliveryClientTypeName: 'CoreDeliveryClient',
    coreDeliveryClientTypesTypeName: 'CoreClientTypes',

    sdkTypes: {
        contentItem: 'IContentItem',
        contentItemElements: 'IContentItemElements',
        elements: 'Elements',
        snippet: 'Snippet',
        deliveryClient: 'IDeliveryClient'
    }
} as const;

export const itemsConfig = {
    itemsFolderName: 'items',
    codenamesFolderName: 'codenames'
} as const;
