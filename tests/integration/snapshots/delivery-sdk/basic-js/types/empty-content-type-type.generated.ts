import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Empty content type' type
 */
export type EmptyContentTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">;

/*
 * Typeguard for codename of 'Empty content type' type
 */
export function isEmptyContentTypeCodename(value: string | undefined | null): value is EmptyContentTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeCodename);
}

/*
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type EmptyContentTypeItem = ContentItemOf<CoreClientSchema, EmptyContentTypeCodename, Record<string, never>>;

/*
 * Type representing all available element codenames for Empty content type
 */
export type EmptyContentTypeElementCodenames = never;

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isEmptyContentTypeItem(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptyContentTypeItem {
	return isEmptyContentTypeCodename(item?.system.type);
}
