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
    workflowStepCodenames: 'WorkflowStepCodenames',
    elementCodenames: 'ElementCodenames'
} as const;

export const migrationConfig = {
    npmPackageName: '@kontent-ai/migration-toolkit',
    migrationItemsFolderName: `contentTypes`,
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
    itemTypesFolderName: `itemTypes`,
    itemSnippetsFolderName: `itemSnippets`,
    systemTypesFolderName: 'system',
    coreCodenamesFilename: 'delivery.codenames',
    coreTypeFilename: 'core.type',
    coreContentTypeName: 'CoreItem',
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
