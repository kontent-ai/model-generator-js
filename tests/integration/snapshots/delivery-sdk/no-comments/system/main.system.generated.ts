import type { DeliveryClient, DeliveryClientSchema } from "@kontent-ai/delivery-sdk";

export type CoreClientSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default", "en-US", "es-ES", "__jp", "🦉Lang"];
	readonly taxonomies: {
		readonly taxonomy_a: readonly ["nested_term_2", "nested_term_1", "term_1", "term_2", "term_3"];
		readonly taxonomy_without_terms: readonly [];
	};
	readonly contentTypes: {
		readonly content_type_with_all_elements: readonly [
			"text_element",
			"url_slug_element",
			"rich_text_element",
			"date___time_element",
			"custom_element",
			"linked_items_element",
			"asset_element",
			"multiple_choice_element",
			"number_element",
			"snippet_a__rich_text_with_all_allowed_item_types",
			"snippet_a__linked_items_with_specific_types",
			"snippet_a__text",
			"taxonomy_element",
		];
		readonly _content_type_with_special_chars____: readonly ["parrot__", "_____numberelem_____________________"];
		readonly empty_content_type: readonly [];
		readonly content_type_with_snippet_only: readonly [
			"snippet_a__rich_text_with_all_allowed_item_types",
			"snippet_a__linked_items_with_specific_types",
			"snippet_a__text",
		];
		readonly content_type_with_guidelines_only: readonly [];
		readonly circular_reference_type_a_b: readonly ["items"];
		readonly circular_reference_type_b____a: readonly ["items"];
		readonly web_spotlight_root: readonly ["title", "subpages", "content"];
		readonly page: readonly ["title", "url", "show_in_navigation", "subpages", "content"];
		readonly type_with_empty_snippet: readonly [];
		readonly type_referencing_deleted_type: readonly ["rich_text_with_invalid_type", "linked_items_with_invalid_type"];
	};
	readonly collectionCodenames: readonly ["legacy_collection", "default"];
	readonly workflowCodenames: readonly ["default", "advanced_workflow"];
	readonly workflowStepCodenames: readonly ["draft", "published", "archived", "scheduled", "draft_b42a7f1", "step_1", "step_2"];
}>;

export type CoreDeliveryClient = DeliveryClient<CoreClientSchema>;
