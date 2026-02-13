/*
 * Type representing all languages
 */
export type LanguageCodenames = "__jp" | "🦉Lang" | "default" | "en-US" | "es-ES";

/*
 * Type representing all content types
 */
export type ContentTypeCodenames =
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
	| "web_spotlight_root";

/*
 * Type representing all collections
 */
export type CollectionCodenames = "default" | "legacy_collection";

/*
 * Type representing all workflows
 */
export type WorkflowCodenames = "advanced_workflow" | "default";

/*
 * Type representing all worksflow steps across all workflows
 */
export type WorkflowStepCodenames = "archived" | "draft_b42a7f1" | "draft" | "published" | "scheduled" | "step_1" | "step_2";
