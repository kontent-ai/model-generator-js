export const coreConfig = {
    barrelExportFilename: 'index.ts'
} as const;

export const migrationConfig = {
    migrationItemsFolderName: `content-types`,
    migrationTypesFilename: `core.models.ts`
} as const;
