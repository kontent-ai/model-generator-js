import type { TypeCodenames } from "./_types.generated.js"
import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CoreType } from "../system/index.generated.js"

/*
 * Type representing codename of 'Empty content type' type
 */
export type ContentTypeEmptyContentTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">

/*
 * Typeguard for codename of 'Empty content type' type
 */
export function isContentTypeEmptyContentTypeCodename(value: string | undefined | null): value is ContentTypeEmptyContentTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies ContentTypeEmptyContentTypeCodename)
}

/*
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type ContentTypeEmptyContentType = CoreType<
	ContentTypeEmptyContentTypeElementCodenames,
	Record<string, never>,
	ContentTypeEmptyContentTypeCodename
>

/*
 * Type representing all available element codenames for Empty content type
 */
export type ContentTypeEmptyContentTypeElementCodenames = never

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isContentTypeEmptyContentType(item: IContentItem | undefined | null): item is ContentTypeEmptyContentType {
	return item?.system.type === ("empty_content_type" satisfies ContentTypeEmptyContentTypeCodename)
}
