import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeWithGuidelinesOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeWithGuidelinesOnlyCodename(value: string | undefined | null): value is ContentTypeWithGuidelinesOnlyCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyCodename);
}

/*
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeWithGuidelinesOnlyItem = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithGuidelinesOnlyCodename,
	Record<string, never>
>;

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeWithGuidelinesOnlyElementCodenames = never;

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeWithGuidelinesOnlyItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithGuidelinesOnlyItem {
	return isContentTypeWithGuidelinesOnlyCodename(item?.system.type);
}
