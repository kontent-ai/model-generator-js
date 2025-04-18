import type { CoreContentType } from '../system/index.js';

/**
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type ContentType_type_with_empty_snippet = CoreContentType<
    ContentType_type_with_empty_snippetElementCodenames,
    Record<string, never>,
    'type_with_empty_snippet'
>;

/**
 * Type representing all available element codenames for Type with empty snippet
 */
export type ContentType_type_with_empty_snippetElementCodenames = never;

/**
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isContentType_type_with_empty_snippet(
    item: CoreContentType | undefined | null
): item is ContentType_type_with_empty_snippet {
    return item?.system?.type === 'type_with_empty_snippet';
}
