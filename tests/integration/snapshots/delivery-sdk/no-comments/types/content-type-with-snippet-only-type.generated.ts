import type { IContentItem } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type ContentTypeWithSnippetOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">;

export function isContentTypeWithSnippetOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithSnippetOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename);
}

export type ContentTypeWithSnippetOnlyType = IContentItem<
	Record<string, never> & SnippetASnippet,
	ContentTypeWithSnippetOnlyTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type ContentTypeWithSnippetOnlyTypeElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

export function isContentTypeWithSnippetOnlyType(item: IContentItem | undefined | null): item is ContentTypeWithSnippetOnlyType {
	return item?.system.type === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename);
}
