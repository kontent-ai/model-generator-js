import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { ContentTypeCircularReferenceTypeAB } from "../types/content-type-circular-reference-type-a-b.generated.js";

/*
 * Type representing codename of 'Circular reference type B -> A' type
 */
export type ContentTypeCircularReferenceTypeBACodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">;

/*
 * Typeguard for codename of 'Circular reference type B -> A' type
 */
export function isContentTypeCircularReferenceTypeBACodename(
	value: string | undefined | null,
): value is ContentTypeCircularReferenceTypeBACodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies ContentTypeCircularReferenceTypeBACodename);
}

/*
 * Elements of the 'Circular reference type B -> A' content type
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type ContentTypeCircularReferenceTypeBAElements = {
	/*
	 * Items
	 *
	 * Codename: items
	 * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
	 * Type: modular_content
	 * Required: false
	 * Allowed content types: circular_reference_type_a_b
	 */
	readonly items: Elements.LinkedItems<ContentTypeCircularReferenceTypeAB>;
};

/*
 * Circular reference type B -> A
 */
export type ContentTypeCircularReferenceTypeBA = ContentItemOf<
	CoreClientSchema,
	ContentTypeCircularReferenceTypeBACodename,
	ContentTypeCircularReferenceTypeBAElements
>;

/*
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type ContentTypeCircularReferenceTypeBAElementCodenames = "items";

/*
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isContentTypeCircularReferenceTypeBA(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeCircularReferenceTypeBA {
	return isContentTypeCircularReferenceTypeBACodename(item?.system.type);
}
