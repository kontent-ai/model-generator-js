import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Empty content type' type
 */
export type EmptyContentTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">;

/*
 * Typeguard for codename of 'Empty content type' type
 */
export function isEmptyContentTypeTypeCodename(value: string | undefined | null): value is EmptyContentTypeTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeTypeCodename);
}

/*
 * Elements of the 'Empty content type' content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type EmptyContentTypeTypeElements = Record<string, never>;

/*
 * Empty content type
 */
export type EmptyContentTypeType = ContentItemOf<CoreClientSchema, EmptyContentTypeTypeCodename, EmptyContentTypeTypeElements>;

/*
 * Type representing all available element codenames for Empty content type
 */
export type EmptyContentTypeTypeElementCodenames = never;

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isEmptyContentTypeType(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptyContentTypeType {
	return isEmptyContentTypeTypeCodename(item?.system.type);
}
