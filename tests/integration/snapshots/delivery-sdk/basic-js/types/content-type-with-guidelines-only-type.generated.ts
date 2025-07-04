import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeWithGuidelinesOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeWithGuidelinesOnlyTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithGuidelinesOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename)
}

/*
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeWithGuidelinesOnlyType = IContentItem<
	Record<string, never>,
	ContentTypeWithGuidelinesOnlyTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeWithGuidelinesOnlyTypeElementCodenames = never

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeWithGuidelinesOnlyType(item: IContentItem | undefined | null): item is ContentTypeWithGuidelinesOnlyType {
	return item?.system.type === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename)
}
