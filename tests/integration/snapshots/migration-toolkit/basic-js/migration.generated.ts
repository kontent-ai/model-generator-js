import type { MigrationElements, MigrationItem, MigrationItemSystem } from "@kontent-ai/migration-toolkit"
import type {
	CollectionCodenames,
	ContentTypeCodenames,
	LanguageCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
} from "./environment/environment.generated.js"

/*
 * System object shared by all individual content type models
 */
export type CoreMigrationItemSystem<TCodename extends ContentTypeCodenames> = MigrationItemSystem<
	TCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames
>

/*
 * Item object shared by all individual content type models
 */
export type CoreMigrationItem<
	TCodename extends ContentTypeCodenames,
	TElements extends MigrationElements = MigrationElements
> = MigrationItem<TElements, CoreMigrationItemSystem<TCodename>, WorkflowStepCodenames>
