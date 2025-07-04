import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeContentTypeWithGuidelinesOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeContentTypeWithGuidelinesOnlyCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithGuidelinesOnlyCodename {
	return (
		typeof value === "string" &&
		value === ("content_type_with_guidelines_only" satisfies ContentTypeContentTypeWithGuidelinesOnlyCodename)
	)
}

/*
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeContentTypeWithGuidelinesOnly = IContentItem<
	Record<string, never>,
	ContentTypeContentTypeWithGuidelinesOnlyCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeContentTypeWithGuidelinesOnlyElementCodenames = never

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeContentTypeWithGuidelinesOnly(
	item: IContentItem | undefined | null
): item is ContentTypeContentTypeWithGuidelinesOnly {
	return item?.system.type === ("content_type_with_guidelines_only" satisfies ContentTypeContentTypeWithGuidelinesOnlyCodename)
}
