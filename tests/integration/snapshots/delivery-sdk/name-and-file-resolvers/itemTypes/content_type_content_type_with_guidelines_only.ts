import type { CoreItem } from '../system/index.js';

/*
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentType_content_type_with_guidelines_only = CoreItem<
	ContentType_content_type_with_guidelines_onlyElementCodenames,
	Record<string, never>,
	'content_type_with_guidelines_only'
>;

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentType_content_type_with_guidelines_onlyElementCodenames = never;

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentType_content_type_with_guidelines_only(
	item: CoreItem | undefined | null
): item is ContentType_content_type_with_guidelines_only {
	return item?.system?.type === 'content_type_with_guidelines_only';
}
