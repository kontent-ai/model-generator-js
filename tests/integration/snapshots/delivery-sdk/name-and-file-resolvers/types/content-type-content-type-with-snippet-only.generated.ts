import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { SnippetSnippetA } from "../snippets/snippet-snippet-a.generated.js"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Content type with snippet only' type
 */
export type ContentTypeContentTypeWithSnippetOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_snippet_only">

/*
 * Typeguard for codename of 'Content type with snippet only' type
 */
export function isContentTypeContentTypeWithSnippetOnlyCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithSnippetOnlyCodename {
	return typeof value === "string" && value === ("content_type_with_snippet_only" satisfies ContentTypeContentTypeWithSnippetOnlyCodename)
}

/*
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeContentTypeWithSnippetOnly = IContentItem<
	Record<string, never> & SnippetSnippetA,
	ContentTypeContentTypeWithSnippetOnlyCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeContentTypeWithSnippetOnlyElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text"

/*
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeContentTypeWithSnippetOnly(
	item: IContentItem | undefined | null
): item is ContentTypeContentTypeWithSnippetOnly {
	return item?.system.type === ("content_type_with_snippet_only" satisfies ContentTypeContentTypeWithSnippetOnlyCodename)
}
