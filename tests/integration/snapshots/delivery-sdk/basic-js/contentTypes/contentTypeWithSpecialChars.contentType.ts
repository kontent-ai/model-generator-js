import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of 🐧 Content type with special chars #!_'
 *
 * Codename: _content_type_with_special_chars____
 */
export type ContentTypeWithSpecialCharsContentTypeCodename = Extract<ContentTypeCodenames, '_content_type_with_special_chars____'>;

/*
 * Type guard for 🐧 Content type with special chars #!_' entity
 *
 * Codename: _content_type_with_special_chars____
 */
export function isContentTypeWithSpecialCharsContentTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithSpecialCharsContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('_content_type_with_special_chars____' satisfies ContentTypeWithSpecialCharsContentTypeCodename)
	);
}
