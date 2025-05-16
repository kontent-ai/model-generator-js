import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { ContentTypeCircularReferenceTypeABType } from './index.js';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: Circular reference type B -> A
 * Codename: circular_reference_type_b____a
 * Type: Type
 */
export type ContentTypeCircularReferenceTypeBATypeCodename = Extract<TypeCodenames, 'circular_reference_type_b____a'>;

/*
 * Typeguard function for entity
 *
 * Name: Circular reference type B -> A
 * Codename: circular_reference_type_b____a
 * Type: Type
 */
export function isContentTypeCircularReferenceTypeBATypeCodename(
	value: string | undefined | null
): value is ContentTypeCircularReferenceTypeBATypeCodename {
	return (
		typeof value === 'string' && value === ('circular_reference_type_b____a' satisfies ContentTypeCircularReferenceTypeBATypeCodename)
	);
}

/*
 * Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type ContentTypeCircularReferenceTypeBAType = CoreType<
	ContentTypeCircularReferenceTypeBATypeElementCodenames,
	{
		/*
		 * Items
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: items
		 * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
		 */
		readonly items: Elements.LinkedItemsElement<ContentTypeCircularReferenceTypeABType>;
	},
	ContentTypeCircularReferenceTypeBATypeCodename
>;

/*
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type ContentTypeCircularReferenceTypeBATypeElementCodenames = 'items';

/*
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isContentTypeCircularReferenceTypeBA(item: CoreType | undefined | null): item is ContentTypeCircularReferenceTypeBAType {
	return item?.system?.type === ('circular_reference_type_b____a' satisfies ContentTypeCircularReferenceTypeBATypeCodename);
}
