import type { SyncClient, SyncClientTypes } from "@kontent-ai/sync-sdk"

/*
 * Use as generic type when creating a sync client for increased type safety
 */
export type CoreSyncClientTypes = SyncClientTypes & {
	readonly languageCodenames: "__jp" | "🦉Lang" | "default" | "en-US" | "es-ES"
	readonly typeCodenames:
		| "_content_type_with_special_chars____"
		| "circular_reference_type_a_b"
		| "circular_reference_type_b____a"
		| "content_type_with_all_elements"
		| "content_type_with_guidelines_only"
		| "content_type_with_snippet_only"
		| "empty_content_type"
		| "page"
		| "type_referencing_deleted_type"
		| "type_with_empty_snippet"
		| "web_spotlight_root"
	readonly workflowCodenames: "advanced_workflow" | "default"
	readonly workflowStepCodenames: "draft_b42a7f1" | "draft" | "step_1" | "step_2"
	readonly collectionCodenames: "default" | "legacy_collection"
	readonly taxonomyCodenames: "taxonomy_a" | "taxonomy_without_terms"
}

/*
 * Type safe sync client
 */
export type CoreSyncClient = SyncClient<CoreSyncClientTypes>
