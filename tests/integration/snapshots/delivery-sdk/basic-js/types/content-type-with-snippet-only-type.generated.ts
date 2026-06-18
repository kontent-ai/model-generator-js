import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippetElements } from "../snippets/snippet-a-snippet.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Content type with snippet only' type
 */
export type ContentTypeWithSnippetOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">;

/*
 * Typeguard for codename of 'Content type with snippet only' type
 */
export function isContentTypeWithSnippetOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithSnippetOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename);
}

/*
 * Elements of the 'Content type with snippet only' content type
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeWithSnippetOnlyTypeElements = SnippetASnippetElements;

/*
 * Content type with snippet only
 */
export type ContentTypeWithSnippetOnlyType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithSnippetOnlyTypeCodename,
	ContentTypeWithSnippetOnlyTypeElements
>;

/*
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeWithSnippetOnlyTypeElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

/*
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeWithSnippetOnlyType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithSnippetOnlyType {
	return isContentTypeWithSnippetOnlyTypeCodename(item?.system.type);
}
