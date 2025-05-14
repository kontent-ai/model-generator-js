import type { TypeCodenames } from './_types.js';

import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of Empty content type
 *
 * Codename: empty_content_type
 */
export type EmptyContentTypeTypeCodename = Extract<TypeCodenames, 'empty_content_type'>;

/*
 * Type guard for Empty content type
 *
 * Codename: empty_content_type
 */
export function isEmptyContentTypeTypeCodename(value: string | undefined | null): value is EmptyContentTypeTypeCodename {
	return typeof value === 'string' && value === ('empty_content_type' satisfies EmptyContentTypeTypeCodename);
}

/*
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type ContentTypeEmptyContentTypeType = CoreType<
	ContentTypeEmptyContentTypeTypeElementCodenames,
	Record<string, never>,
	ContentTypeEmptyContentTypeTypeCodename
>;

/*
 * Type representing all available element codenames for Empty content type
 */
export type ContentTypeEmptyContentTypeTypeElementCodenames = never;

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isContentTypeEmptyContentTypeType(item: CoreType | undefined | null): item is ContentTypeEmptyContentTypeType {
	return item?.system?.type === 'empty_content_type';
}
