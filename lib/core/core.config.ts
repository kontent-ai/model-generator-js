export const coreConfig = {
    barrelExportFilename: 'index.ts'
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
        languageCodenames: 'LanguageCodenames',
        collectionCodenames: 'CollectionCodenames',
        workflowCodenames: 'WorkflowCodenames',
        workflowStepCodenames: 'WorkflowStepCodenames',
        contentTypeCodenames: 'ContentTypeCodenames',
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

    sdkTypes: {
        contentItem: 'IContentItem',
        elements: 'Elements'
    }
} as const;
