import type { DeliveryApiMode, LibraryType, ModuleFileExtension } from "./core/core.models.js";
import { sdkInfo } from "./sdk-info.js";

export const defaultModuleFileExtension: ModuleFileExtension = "js";
export const defaultDeliveryApiMode: DeliveryApiMode = "default";

export const coreConfig = {
	barrelExportFilename: "index.ts",
	kontentTrackingHeaderName: "X-KC-SOURCE",
	kontentTrackingHeaderValue: `${sdkInfo.name};${sdkInfo.version}`,
} as const;

export const syncConfig = {
	npmPackageName: "@kontent-ai/sync-sdk" satisfies LibraryType,
	coreTypesFilename: "sync.models",
	coreClientTypesTypeName: "CoreSyncClientTypes",
	coreClientTypeName: "CoreSyncClient",
	sdkTypes: {
		syncClientTypes: "SyncClientTypes",
		syncClient: "SyncClient",
	},
} as const;

export const migrationConfig = {
	npmPackageName: "@kontent-ai/migration-toolkit" satisfies LibraryType,
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

export const deliveryConfig = {
	npmPackageName: "@kontent-ai/delivery-sdk" satisfies LibraryType,
	systemTypesFolderName: "system",
	mainSystemFilename: "main.system",
	coreContentTypeName: "CoreType",
	coreDeliveryClientTypeName: "CoreDeliveryClient",
	coreDeliveryClientTypesTypeName: "CoreClientTypes",

	sdkTypes: {
		contentItem: "IContentItem",
		contentItemElements: "IContentItemElements",
		elements: "Elements",
		snippet: "Snippet",
		deliveryClient: "IDeliveryClient",
	},
} as const;

export const itemsConfig = {
	itemsFolderName: "items",
	codenamesFolderName: "codenames",
} as const;
