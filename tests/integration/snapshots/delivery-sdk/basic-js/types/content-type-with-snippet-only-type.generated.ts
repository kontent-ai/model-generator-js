import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Content type with snippet only' type
 */
export type ContentTypeWithSnippetOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">

/*
 * Typeguard for codename of 'Content type with snippet only' type
 */
export function isContentTypeWithSnippetOnlyTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithSnippetOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename)
}

/*
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeWithSnippetOnlyType = IContentItem<
	Record<string, never> & SnippetASnippet,
	ContentTypeWithSnippetOnlyTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeWithSnippetOnlyTypeElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text"

/*
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeWithSnippetOnlyType(item: IContentItem | undefined | null): item is ContentTypeWithSnippetOnlyType {
	return item?.system.type === ("content_type_with_snippet_only" satisfies ContentTypeWithSnippetOnlyTypeCodename)
}
