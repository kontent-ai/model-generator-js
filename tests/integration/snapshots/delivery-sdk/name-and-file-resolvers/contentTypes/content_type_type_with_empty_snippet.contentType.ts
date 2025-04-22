import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Type with empty snippet
 *
 * Codename: type_with_empty_snippet
 */
export type ContentType_type_with_empty_snippetContentTypeCodename = Extract<ContentTypeCodenames, 'type_with_empty_snippet'>;

/*
 * Type guard for Type with empty snippet
 *
 * Codename: type_with_empty_snippet
 */
export function isContentType_type_with_empty_snippetContentTypeCodename(
	value: string | undefined | null
): value is ContentType_type_with_empty_snippetContentTypeCodename {
	return (
		typeof value === 'string' && value === ('type_with_empty_snippet' satisfies ContentType_type_with_empty_snippetContentTypeCodename)
	);
}
