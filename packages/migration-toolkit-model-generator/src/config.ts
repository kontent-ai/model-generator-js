export const migrationConfig = {
	npmPackageName: "@kontent-ai/migration-toolkit",
	migrationItemsFolderName: "contentTypes",
	environmentFolderName: "environment",
	migrationTypesFilename: "migration",
	environmentFilename: "environment",

	workflowStepCodenames: "WorkflowStepCodenames",
	languageCodenames: "LanguageCodenames",
	contentTypeCodenames: "ContentTypeCodenames",
	workflowCodenames: "WorkflowCodenames",
	taxonomyCodenames: "TaxonomyCodenames",
	collectionCodenames: "CollectionCodenames",

	sdkTypeNames: {
		system: "MigrationItemSystem",
		item: "MigrationItem",
		elements: "MigrationElements",
		elementModels: "MigrationElementModels",
	},

	localTypeNames: {
		system: "CoreMigrationItemSystem",
		item: "CoreMigrationItem",
		codename: "TCodename",
		elements: "TElements",
	},
} as const;
