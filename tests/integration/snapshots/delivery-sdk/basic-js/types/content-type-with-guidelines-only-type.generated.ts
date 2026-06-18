import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeWithGuidelinesOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeWithGuidelinesOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithGuidelinesOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename);
}

/*
 * Elements of the 'Content type with guidelines only' content type
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeWithGuidelinesOnlyTypeElements = Record<string, never>;

/*
 * Content type with guidelines only
 */
export type ContentTypeWithGuidelinesOnlyType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithGuidelinesOnlyTypeCodename,
	ContentTypeWithGuidelinesOnlyTypeElements
>;

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeWithGuidelinesOnlyTypeElementCodenames = never;

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeWithGuidelinesOnlyType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithGuidelinesOnlyType {
	return isContentTypeWithGuidelinesOnlyTypeCodename(item?.system.type);
}
