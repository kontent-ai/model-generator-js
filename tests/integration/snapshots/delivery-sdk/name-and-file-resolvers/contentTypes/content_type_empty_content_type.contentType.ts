import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Empty content type
 *
 * Codename: empty_content_type
 */
export type ContentType_empty_content_typeContentTypeCodename = Extract<ContentTypeCodenames, 'empty_content_type'>;

/*
 * Type guard for Empty content type
 *
 * Codename: empty_content_type
 */
export function isContentType_empty_content_typeContentTypeCodename(
	value: string | undefined | null
): value is ContentType_empty_content_typeContentTypeCodename {
	return typeof value === 'string' && value === ('empty_content_type' satisfies ContentType_empty_content_typeContentTypeCodename);
}
