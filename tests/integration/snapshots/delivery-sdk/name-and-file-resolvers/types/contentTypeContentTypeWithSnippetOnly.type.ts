import type { TypeCodenames } from './_types.js';

import type { CoreType } from '../system/index.js';
import type { SnippetSnippetASnippet } from '../snippets/index.js';

/*
 * Type representing codename of 'Content type with snippet only' type
 */
export type ContentTypeContentTypeWithSnippetOnlyTypeCodename = Extract<TypeCodenames, 'content_type_with_snippet_only'>;

/*
 * Typeguard for codename of 'Content type with snippet only' type
 */
export function isContentTypeContentTypeWithSnippetOnlyTypeCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithSnippetOnlyTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('content_type_with_snippet_only' satisfies ContentTypeContentTypeWithSnippetOnlyTypeCodename)
	);
}

/*
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeContentTypeWithSnippetOnlyType = CoreType<
	ContentTypeContentTypeWithSnippetOnlyTypeElementCodenames,
	Record<string, never> & SnippetSnippetASnippet,
	ContentTypeContentTypeWithSnippetOnlyTypeCodename
>;

/*
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeContentTypeWithSnippetOnlyTypeElementCodenames =
	| 'snippet_a__rich_text_with_all_allowed_item_types'
	| 'snippet_a__linked_items_with_specific_types'
	| 'snippet_a__text';

/*
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeContentTypeWithSnippetOnly(
	item: CoreType | undefined | null
): item is ContentTypeContentTypeWithSnippetOnlyType {
	return item?.system?.type === ('content_type_with_snippet_only' satisfies ContentTypeContentTypeWithSnippetOnlyTypeCodename);
}
