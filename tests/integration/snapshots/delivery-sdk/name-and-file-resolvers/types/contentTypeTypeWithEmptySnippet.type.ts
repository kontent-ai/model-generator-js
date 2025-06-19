import type { TypeCodenames } from "./_types.js"
import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CoreType } from "../system/index.js"

/*
 * Type representing codename of 'Type with empty snippet' type
 */
export type ContentTypeTypeWithEmptySnippetCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">

/*
 * Typeguard for codename of 'Type with empty snippet' type
 */
export function isContentTypeTypeWithEmptySnippetCodename(
	value: string | undefined | null
): value is ContentTypeTypeWithEmptySnippetCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies ContentTypeTypeWithEmptySnippetCodename)
}

/*
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type ContentTypeTypeWithEmptySnippet = CoreType<
	ContentTypeTypeWithEmptySnippetElementCodenames,
	Record<string, never>,
	ContentTypeTypeWithEmptySnippetCodename
>

/*
 * Type representing all available element codenames for Type with empty snippet
 */
export type ContentTypeTypeWithEmptySnippetElementCodenames = never

/*
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isContentTypeTypeWithEmptySnippet(item: IContentItem | undefined | null): item is ContentTypeTypeWithEmptySnippet {
	return item?.system.type === ("type_with_empty_snippet" satisfies ContentTypeTypeWithEmptySnippetCodename)
}
