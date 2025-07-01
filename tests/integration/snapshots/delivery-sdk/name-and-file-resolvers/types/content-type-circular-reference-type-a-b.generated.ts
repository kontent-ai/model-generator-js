import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"
import type { ContentTypeCircularReferenceTypeBA } from "../types/content-type-circular-reference-type-b-a.generated.js"

/*
 * Type representing codename of 'Circular reference type A > B' type
 */
export type ContentTypeCircularReferenceTypeABCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_a_b">

/*
 * Typeguard for codename of 'Circular reference type A > B' type
 */
export function isContentTypeCircularReferenceTypeABCodename(
	value: string | undefined | null
): value is ContentTypeCircularReferenceTypeABCodename {
	return typeof value === "string" && value === ("circular_reference_type_a_b" satisfies ContentTypeCircularReferenceTypeABCodename)
}

/*
 * Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export type ContentTypeCircularReferenceTypeAB = IContentItem<
	{
		/*
		 * Items
		 *
		 * Codename: items
		 * Id: 33ab92dd-e47d-45e2-a060-3b5df0754c24
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: circular_reference_type_b____a
		 */
		readonly items: Elements.LinkedItemsElement<ContentTypeCircularReferenceTypeBA>
	},
	ContentTypeCircularReferenceTypeABCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Circular reference type A > B
 */
export type ContentTypeCircularReferenceTypeABElementCodenames = "items"

/*
 * Type guard for Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export function isContentTypeCircularReferenceTypeAB(item: IContentItem | undefined | null): item is ContentTypeCircularReferenceTypeAB {
	return item?.system.type === ("circular_reference_type_a_b" satisfies ContentTypeCircularReferenceTypeABCodename)
}
