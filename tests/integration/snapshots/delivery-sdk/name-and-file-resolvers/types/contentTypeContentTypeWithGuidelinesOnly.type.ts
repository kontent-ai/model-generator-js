import type { TypeCodenames } from './_types.js';

import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of 'Content type with guidelines only' type
 */
export type ContentTypeContentTypeWithGuidelinesOnlyTypeCodename = Extract<TypeCodenames, 'content_type_with_guidelines_only'>;

/*
 * Typeguard for codename of 'Content type with guidelines only' type
 */
export function isContentTypeContentTypeWithGuidelinesOnlyTypeCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithGuidelinesOnlyTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('content_type_with_guidelines_only' satisfies ContentTypeContentTypeWithGuidelinesOnlyTypeCodename)
	);
}

/*
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeContentTypeWithGuidelinesOnlyType = CoreType<
	ContentTypeContentTypeWithGuidelinesOnlyTypeElementCodenames,
	Record<string, never>,
	ContentTypeContentTypeWithGuidelinesOnlyTypeCodename
>;

/*
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeContentTypeWithGuidelinesOnlyTypeElementCodenames = never;

/*
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeContentTypeWithGuidelinesOnly(
	item: CoreType | undefined | null
): item is ContentTypeContentTypeWithGuidelinesOnlyType {
	return item?.system?.type === ('content_type_with_guidelines_only' satisfies ContentTypeContentTypeWithGuidelinesOnlyTypeCodename);
}
