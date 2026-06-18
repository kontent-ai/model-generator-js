import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { CircularReferenceTypeABItem } from "../types/circular-reference-type-a-b-type.generated.js";

/*
 * Type representing codename of 'Circular reference type B -> A' type
 */
export type CircularReferenceTypeBACodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">;

/*
 * Typeguard for codename of 'Circular reference type B -> A' type
 */
export function isCircularReferenceTypeBACodename(value: string | undefined | null): value is CircularReferenceTypeBACodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBACodename);
}

/*
 * Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type CircularReferenceTypeBAItem = ContentItemOf<
	CoreClientSchema,
	CircularReferenceTypeBACodename,
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
		readonly items: Elements.LinkedItems<CircularReferenceTypeABItem>;
	}
>;

/*
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type CircularReferenceTypeBAElementCodenames = "items";

/*
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isCircularReferenceTypeBAItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is CircularReferenceTypeBAItem {
	return isCircularReferenceTypeBACodename(item?.system.type);
}
