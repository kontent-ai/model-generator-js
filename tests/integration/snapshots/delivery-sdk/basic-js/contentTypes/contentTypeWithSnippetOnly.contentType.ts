import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Content type with snippet only
 *
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeWithSnippetOnlyContentTypeCodename = Extract<ContentTypeCodenames, 'content_type_with_snippet_only'>;

/*
 * Type guard for Content type with snippet only
 *
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeWithSnippetOnlyContentTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithSnippetOnlyContentTypeCodename {
	return (
		typeof value === 'string' && value === ('content_type_with_snippet_only' satisfies ContentTypeWithSnippetOnlyContentTypeCodename)
	);
}
