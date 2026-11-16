import type { DeliveryClient, DeliveryClientSchema } from "@kontent-ai/delivery-sdk";
import type { TypedItem } from "./types.generated.js";

/*
 * Schema describing this environment, used to strongly type 'DeliveryClient'
 */
export type TypedClientSchema = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["default", "en-US", "es-ES", "__jp", "🦉Lang"];
	readonly collectionCodenames: readonly ["legacy_collection", "default"];
	readonly taxonomies: {
		readonly taxonomy_a: readonly ["nested_term_1", "nested_term_2", "term_1", "term_2", "term_3"];
		readonly taxonomy_without_terms: readonly [];
	};
	readonly workflows: {
		readonly default: readonly ["draft", "scheduled", "published", "archived"];
		readonly advanced_workflow: readonly ["draft_b42a7f1", "step_1", "step_2", "scheduled", "published", "archived"];
	};
	readonly contentTypes: {
		readonly content_type_with_all_elements: {
			readonly text_element: { readonly type: "text" };
			readonly url_slug_element: { readonly type: "url_slug" };
			readonly rich_text_element: { readonly type: "rich_text" };
			readonly date___time_element: { readonly type: "date_time" };
			readonly custom_element: { readonly type: "custom" };
			readonly linked_items_element: { readonly type: "modular_content" };
			readonly asset_element: { readonly type: "asset" };
			readonly multiple_choice_element: { readonly type: "multiple_choice"; readonly options: readonly ["option_a", "option_b"] };
			readonly number_element: { readonly type: "number" };
			readonly snippet_a__rich_text_with_all_allowed_item_types: { readonly type: "rich_text" };
			readonly snippet_a__linked_items_with_specific_types: { readonly type: "modular_content" };
			readonly snippet_a__text: { readonly type: "text" };
			readonly taxonomy_element: { readonly type: "taxonomy"; readonly taxonomyGroup: "taxonomy_a" };
		};
		readonly _content_type_with_special_chars____: {
			readonly parrot__: { readonly type: "text" };
			readonly _____numberelem_____________________: { readonly type: "number" };
		};
		readonly empty_content_type: Record<string, never>;
		readonly content_type_with_snippet_only: {
			readonly snippet_a__rich_text_with_all_allowed_item_types: { readonly type: "rich_text" };
			readonly snippet_a__linked_items_with_specific_types: { readonly type: "modular_content" };
			readonly snippet_a__text: { readonly type: "text" };
		};
		readonly content_type_with_guidelines_only: Record<string, never>;
		readonly circular_reference_type_a_b: {
			readonly items: { readonly type: "modular_content" };
		};
		readonly circular_reference_type_b____a: {
			readonly items: { readonly type: "modular_content" };
		};
		readonly web_spotlight_root: {
			readonly title: { readonly type: "text" };
			readonly subpages: { readonly type: "modular_content" };
			readonly content: { readonly type: "modular_content" };
		};
		readonly page: {
			readonly title: { readonly type: "text" };
			readonly url: { readonly type: "url_slug" };
			readonly show_in_navigation: { readonly type: "multiple_choice"; readonly options: readonly ["yes", "no"] };
			readonly subpages: { readonly type: "modular_content" };
			readonly content: { readonly type: "modular_content" };
		};
		readonly type_with_empty_snippet: Record<string, never>;
		readonly type_referencing_deleted_type: {
			readonly rich_text_with_invalid_type: { readonly type: "rich_text" };
			readonly linked_items_with_invalid_type: { readonly type: "modular_content" };
		};
	};
}>;

/*
 * Typed delivery client. Responses are typed with 'TypedItem'. Create it with 'createDeliveryClient<TypedClientSchema, TypedItem>(...)'
 */
export type TypedDeliveryClient = DeliveryClient<TypedClientSchema, TypedItem>;
