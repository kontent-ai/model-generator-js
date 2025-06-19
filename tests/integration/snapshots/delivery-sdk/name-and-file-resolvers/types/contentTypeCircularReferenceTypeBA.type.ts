import type { TypeCodenames } from "./_types.js"
import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { ContentTypeCircularReferenceTypeAB } from "./index.js"
import type { CoreType } from "../system/index.js"

/*
 * Type representing codename of 'Circular reference type B -> A' type
 */
export type ContentTypeCircularReferenceTypeBACodename = Extract<TypeCodenames, "circular_reference_type_b____a">

/*
 * Typeguard for codename of 'Circular reference type B -> A' type
 */
export function isContentTypeCircularReferenceTypeBACodename(
	value: string | undefined | null
): value is ContentTypeCircularReferenceTypeBACodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies ContentTypeCircularReferenceTypeBACodename)
}

/*
 * Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type ContentTypeCircularReferenceTypeBA = CoreType<
	ContentTypeCircularReferenceTypeBAElementCodenames,
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
		readonly items: Elements.LinkedItemsElement<ContentTypeCircularReferenceTypeAB>
	},
	ContentTypeCircularReferenceTypeBACodename
>

/*
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type ContentTypeCircularReferenceTypeBAElementCodenames = "items"

/*
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isContentTypeCircularReferenceTypeBA(item: IContentItem | undefined | null): item is ContentTypeCircularReferenceTypeBA {
	return item?.system.type === ("circular_reference_type_b____a" satisfies ContentTypeCircularReferenceTypeBACodename)
}
