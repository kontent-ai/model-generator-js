import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type ContentTypeWithSnippetOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">;

export function isContentTypeWithSnippetOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithSnippetOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename);
}

export type ContentTypeWithSnippetOnlyType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithSnippetOnlyTypeCodename,
	SnippetASnippet["elements"]
>;

export type ContentTypeWithSnippetOnlyTypeElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

export function isContentTypeWithSnippetOnlyType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithSnippetOnlyType {
	return isContentTypeWithSnippetOnlyTypeCodename(item?.system.type);
}
