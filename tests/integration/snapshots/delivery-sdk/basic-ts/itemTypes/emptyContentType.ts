import type { CoreItem } from '../system/index.ts';

/*
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type EmptyContentType = CoreItem<EmptyContentTypeElementCodenames, Record<string, never>, 'empty_content_type'>;

/*
 * Type representing all available element codenames for Empty content type
 */
export type EmptyContentTypeElementCodenames = never;

/*
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isEmptyContentType(item: CoreItem | undefined | null): item is EmptyContentType {
	return item?.system?.type === 'empty_content_type';
}
