import type { TypeCodenames } from './_types.js';

import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: Type with empty snippet
 * Codename: type_with_empty_snippet
 * Type: Type
 */
export type TypeWithEmptySnippetTypeCodename = Extract<TypeCodenames, 'type_with_empty_snippet'>;

/*
 * Type guard for Type with empty snippet
 *
 * Name: Type with empty snippet
 * Codename: type_with_empty_snippet
 * Type: Type
 */
export function isTypeWithEmptySnippetTypeCodename(value: string | undefined | null): value is TypeWithEmptySnippetTypeCodename {
	return typeof value === 'string' && value === ('type_with_empty_snippet' satisfies TypeWithEmptySnippetTypeCodename);
}

/*
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type ContentTypeTypeWithEmptySnippetType = CoreType<
	ContentTypeTypeWithEmptySnippetTypeElementCodenames,
	Record<string, never>,
	ContentTypeTypeWithEmptySnippetTypeCodename
>;

/*
 * Type representing all available element codenames for Type with empty snippet
 */
export type ContentTypeTypeWithEmptySnippetTypeElementCodenames = never;

/*
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isContentTypeTypeWithEmptySnippetType(item: CoreType | undefined | null): item is ContentTypeTypeWithEmptySnippetType {
	return item?.system?.type === 'type_with_empty_snippet';
}
