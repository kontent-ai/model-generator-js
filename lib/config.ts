export const coreConfig = {
    barrelExportFilename: 'index.ts'
} as const;

export const sharedTypesConfig = {
    languageCodenames: 'LanguageCodenames',
    collectionCodenames: 'CollectionCodenames',
    workflowCodenames: 'WorkflowCodenames',
    workflowStepCodenames: 'WorkflowStepCodenames',
    contentTypeCodenames: 'ContentTypeCodenames'
};

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
        system: 'ItemSystem',
        item: 'Item',
        codename: 'TCodename',
        elements: 'TElements'
    }
} as const;

export const deliveryConfig = {
    npmPackageName: '@kontent-ai/delivery-sdk',
    contentTypesFolderName: `content-types`,
    contentTypeSnippetsFolderName: `content-type-snippets`,
    taxonomiesFolderName: `taxonomies`,
    systemTypesFolderName: 'system',
    coreCodenamesFilename: 'delivery.codenames',

    sdkTypes: {
        contentItem: 'IContentItem',
        contentItemElements: 'IContentItemElements',
        elements: 'Elements'
    }
} as const;

export const itemsConfig = {
    itemsFolderName: 'items',
    codenamesFolderName: 'codenames'
} as const;
