export const coreConfig = {
    barrelExportFilename: 'index.ts'
} as const;

export const migrationConfig = {
    npmPackageName: '@kontent-ai/migration-toolkit',
    migrationItemsFolderName: `content-types`,
    migrationTypesFilename: `core.models.ts`
} as const;

export const deliveryConfig = {
    npmPackageName: '@kontent-ai/delivery-sdk',
    contentTypesFolderName: `content-types`,
    contentTypeSnippetsFolderName: `content-type-snippets`,
    taxonomiesFolderName: `taxonomies`
} as const;
