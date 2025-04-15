import type { ContentTypeCodenames } from './_contentTypes.js';

/**
 * Type representing codename of Circular reference type B -> A ContentType
 *
 * Codename: circular_reference_type_b____a
 */
export type ContentType_circular_reference_type_b____aContentTypeCodename = Extract<ContentTypeCodenames, 'circular_reference_type_b____a'>;

/**
 * Type guard for Circular reference type B -> A entity
 *
 * Codename: circular_reference_type_b____a
 */
export function isContentType_circular_reference_type_b____aContentTypeCodename(
    value: string | undefined | null
): value is ContentType_circular_reference_type_b____aContentTypeCodename {
    return (
        typeof value === 'string' &&
        value === ('circular_reference_type_b____a' satisfies ContentType_circular_reference_type_b____aContentTypeCodename)
    );
}
