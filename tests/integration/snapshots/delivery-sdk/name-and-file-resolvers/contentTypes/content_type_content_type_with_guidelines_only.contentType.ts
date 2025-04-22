import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Content type with guidelines only
 *
 * Codename: content_type_with_guidelines_only
 */
export type ContentType_content_type_with_guidelines_onlyContentTypeCodename = Extract<
	ContentTypeCodenames,
	'content_type_with_guidelines_only'
>;

/*
 * Type guard for Content type with guidelines only entity
 *
 * Codename: content_type_with_guidelines_only
 */
export function isContentType_content_type_with_guidelines_onlyContentTypeCodename(
	value: string | undefined | null
): value is ContentType_content_type_with_guidelines_onlyContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('content_type_with_guidelines_only' satisfies ContentType_content_type_with_guidelines_onlyContentTypeCodename)
	);
}
