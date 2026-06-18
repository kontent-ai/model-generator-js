import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { SnippetSnippetA } from "../snippets/snippet-snippet-a.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Content type with snippet only' type
 */
export type ContentTypeContentTypeWithSnippetOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">;

/*
 * Typeguard for codename of 'Content type with snippet only' type
 */
export function isContentTypeContentTypeWithSnippetOnlyCodename(
	value: string | undefined | null,
): value is ContentTypeContentTypeWithSnippetOnlyCodename {
	return (
		typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeContentTypeWithSnippetOnlyCodename)
	);
}

/*
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeContentTypeWithSnippetOnly = ContentItemOf<
	CoreClientSchema,
	ContentTypeContentTypeWithSnippetOnlyCodename,
	SnippetSnippetA["elements"]
>;

/*
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeContentTypeWithSnippetOnlyElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

/*
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeContentTypeWithSnippetOnly(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeContentTypeWithSnippetOnly {
	return isContentTypeContentTypeWithSnippetOnlyCodename(item?.system.type);
}
