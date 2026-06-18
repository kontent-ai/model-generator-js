import type { ContentItemPayload, Elements, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { SnippetCodenames } from "../system/snippets.generated.js";
import type { CoreType } from "../system/types.generated.js";
import type {
	ContentTypeWithAllElementsType,
	ContentTypeWithAllElementsTypeCodename,
} from "../types/content-type-with-all-elements-type.generated.js";
import type { ContentTypeWithSnippetOnlyTypeCodename } from "../types/content-type-with-snippet-only-type.generated.js";

/*
 * Type representing codename of 'Snippet A' snippet
 */
export type SnippetASnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "snippet_a">;

/*
 * Typeguard for codename of 'Snippet A' snippet
 */
export function isSnippetASnippetCodename(value: string | undefined | null): value is SnippetASnippetCodename {
	return typeof value === "string" && value === ("snippet_a" satisfies SnippetASnippetCodename);
}

/*
 * Elements of the 'Snippet A' snippet. Intersect this into the elements of content types that use the snippet.
 *
 * Id: b74eb5f6-c851-42f2-9fea-e367d0a3fa61
 * Codename: snippet_a
 */
export type SnippetASnippetElements = {
	/*
	 * Rich text with all allowed item types
	 *
	 * Codename: snippet_a__rich_text_with_all_allowed_item_types
	 * Id: 72cdc4e7-dead-4baf-99bf-91d8fe62351f
	 * Type: rich_text
	 * Required: false
	 */
	readonly snippet_a__rich_text_with_all_allowed_item_types: Elements.RichText<CoreType>;

	/*
	 * Linked items with specific types
	 *
	 * Codename: snippet_a__linked_items_with_specific_types
	 * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
	 * Type: modular_content
	 * Required: false
	 * Allowed content types: content_type_with_all_elements
	 */
	readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItems<ContentTypeWithAllElementsType>;

	/*
	 * Text
	 *
	 * Codename: snippet_a__text
	 * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
	 * Type: text
	 * Required: true
	 */
	readonly snippet_a__text: Elements.Text;
};

/*
 * Snippet 'Snippet A' as a partial content item across the content types that use it
 */
export type SnippetASnippet = SnippetOf<
	CoreClientSchema,
	ContentTypeWithAllElementsTypeCodename | ContentTypeWithSnippetOnlyTypeCodename,
	SnippetASnippetElements
>;

/*
 * Type representing all available element codenames for Snippet A
 */
export type SnippetASnippetElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

/*
 * Type guard for Snippet A
 */
export function isSnippetASnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is SnippetASnippet {
	return !!item && (["content_type_with_all_elements", "content_type_with_snippet_only"] as readonly string[]).includes(item.system.type);
}
