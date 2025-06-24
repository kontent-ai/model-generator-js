import type { TypeCodenames } from "./_types.generated.js"
import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CoreType } from "../system/index.generated.js"

/*
 * Type representing codename of 'Empty content type' type
 */
export type EmptyContentTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">

/*
 * Typeguard for codename of 'Empty content type' type
 */
export function isEmptyContentTypeTypeCodename(value: string | undefined | null): value is EmptyContentTypeTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeTypeCodename)
}

/*
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type EmptyContentTypeType = CoreType<EmptyContentTypeTypeElementCodenames, Record<string, never>, EmptyContentTypeTypeCodename>

/*
 * Type representing all available element codenames for Empty content type
 */
export type EmptyContentTypeTypeElementCodenames = never

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isEmptyContentTypeType(item: IContentItem | undefined | null): item is EmptyContentTypeType {
	return item?.system.type === ("empty_content_type" satisfies EmptyContentTypeTypeCodename)
}
