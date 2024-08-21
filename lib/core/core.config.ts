export const coreConfig = {
    barrelExportFilename: 'index.ts'
} as const;

export const migrationConfig = {
    migrationItemsFolderName: `content-types`,
    migrationTypesFilename: `core.models.ts`
} as const;

export const deliveryConfig = {
    contentTypesFolderName: `content-types`,
    contentTypeSnippetsFolderName: `content-type-snippets`,
    taxonomiesFolderName: `taxonomies`
} as const;
