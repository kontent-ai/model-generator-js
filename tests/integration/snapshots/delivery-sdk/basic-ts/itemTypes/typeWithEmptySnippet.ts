import type { CoreItem } from '../system/index.ts';

/*
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type TypeWithEmptySnippet = CoreItem<TypeWithEmptySnippetElementCodenames, Record<string, never>, 'type_with_empty_snippet'>;

/*
 * Type representing all available element codenames for Type with empty snippet
 */
export type TypeWithEmptySnippetElementCodenames = never;

/*
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isTypeWithEmptySnippet(item: CoreItem | undefined | null): item is TypeWithEmptySnippet {
	return item?.system?.type === 'type_with_empty_snippet';
}
