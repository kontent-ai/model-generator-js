import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Circular reference type A > B
 *
 * Codename: circular_reference_type_a_b
 */
export type CircularReferenceTypeABContentTypeCodename = Extract<ContentTypeCodenames, 'circular_reference_type_a_b'>;

/*
 * Type guard for Circular reference type A > B
 *
 * Codename: circular_reference_type_a_b
 */
export function isCircularReferenceTypeABContentTypeCodename(
	value: string | undefined | null
): value is CircularReferenceTypeABContentTypeCodename {
	return typeof value === 'string' && value === ('circular_reference_type_a_b' satisfies CircularReferenceTypeABContentTypeCodename);
}
