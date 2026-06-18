import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeContentTypeWithGuidelinesOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeContentTypeWithGuidelinesOnlyCodename(
	value: string | undefined | null,
): value is ContentTypeContentTypeWithGuidelinesOnlyCodename {
	return (
		typeof value === "string" &&
		value === ("content_type_with_guidelines_only" satisfies ContentTypeContentTypeWithGuidelinesOnlyCodename)
	);
}

/*
 * Elements of the 'Content type with guidelines only' content type
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeContentTypeWithGuidelinesOnlyElements = Record<string, never>;

/*
 * Content type with guidelines only
 */
export type ContentTypeContentTypeWithGuidelinesOnly = ContentItemOf<
	CoreClientSchema,
	ContentTypeContentTypeWithGuidelinesOnlyCodename,
	ContentTypeContentTypeWithGuidelinesOnlyElements
>;

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeContentTypeWithGuidelinesOnlyElementCodenames = never;

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeContentTypeWithGuidelinesOnly(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeContentTypeWithGuidelinesOnly {
	return isContentTypeContentTypeWithGuidelinesOnlyCodename(item?.system.type);
}
