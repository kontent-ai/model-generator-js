import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"
import type { CircularReferenceTypeABType } from "../types/circular-reference-type-a-b-type.generated.js"

/*
 * Type representing codename of 'Circular reference type B -> A' type
 */
export type CircularReferenceTypeBATypeCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">

/*
 * Typeguard for codename of 'Circular reference type B -> A' type
 */
export function isCircularReferenceTypeBATypeCodename(value: string | undefined | null): value is CircularReferenceTypeBATypeCodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBATypeCodename)
}

/*
 * Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type CircularReferenceTypeBAType = IContentItem<
	{
		/*
		 * Items
		 *
		 * Codename: items
		 * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: circular_reference_type_a_b
		 */
		readonly items: Elements.LinkedItemsElement<CircularReferenceTypeABType>
	},
	CircularReferenceTypeBATypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type CircularReferenceTypeBATypeElementCodenames = "items"

/*
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isCircularReferenceTypeBAType(item: IContentItem | undefined | null): item is CircularReferenceTypeBAType {
	return item?.system.type === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBATypeCodename)
}
