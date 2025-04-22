import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Circular reference type A > B
 *
 * Codename: circular_reference_type_a_b
 */
export type ContentType_circular_reference_type_a_bContentTypeCodename = Extract<ContentTypeCodenames, 'circular_reference_type_a_b'>;

/*
 * Type guard for Circular reference type A > B entity
 *
 * Codename: circular_reference_type_a_b
 */
export function isContentType_circular_reference_type_a_bContentTypeCodename(
	value: string | undefined | null
): value is ContentType_circular_reference_type_a_bContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('circular_reference_type_a_b' satisfies ContentType_circular_reference_type_a_bContentTypeCodename)
	);
}
