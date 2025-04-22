import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Circular reference type B -> A
 *
 * Codename: circular_reference_type_b____a
 */
export type CircularReferenceTypeBAContentTypeCodename = Extract<ContentTypeCodenames, 'circular_reference_type_b____a'>;

/*
 * Type guard for Circular reference type B -> A entity
 *
 * Codename: circular_reference_type_b____a
 */
export function isCircularReferenceTypeBAContentTypeCodename(
	value: string | undefined | null
): value is CircularReferenceTypeBAContentTypeCodename {
	return typeof value === 'string' && value === ('circular_reference_type_b____a' satisfies CircularReferenceTypeBAContentTypeCodename);
}
