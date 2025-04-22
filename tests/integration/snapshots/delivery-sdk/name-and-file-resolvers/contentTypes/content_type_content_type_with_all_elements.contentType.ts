import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Content type with all elements
 *
 * Codename: content_type_with_all_elements
 */
export type ContentType_content_type_with_all_elementsContentTypeCodename = Extract<ContentTypeCodenames, 'content_type_with_all_elements'>;

/*
 * Type guard for Content type with all elements entity
 *
 * Codename: content_type_with_all_elements
 */
export function isContentType_content_type_with_all_elementsContentTypeCodename(
	value: string | undefined | null
): value is ContentType_content_type_with_all_elementsContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('content_type_with_all_elements' satisfies ContentType_content_type_with_all_elementsContentTypeCodename)
	);
}
