import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Content type with snippet only
 *
 * Codename: content_type_with_snippet_only
 */
export type ContentType_content_type_with_snippet_onlyContentTypeCodename = Extract<ContentTypeCodenames, 'content_type_with_snippet_only'>;

/*
 * Type guard for Content type with snippet only entity
 *
 * Codename: content_type_with_snippet_only
 */
export function isContentType_content_type_with_snippet_onlyContentTypeCodename(
	value: string | undefined | null
): value is ContentType_content_type_with_snippet_onlyContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('content_type_with_snippet_only' satisfies ContentType_content_type_with_snippet_onlyContentTypeCodename)
	);
}
