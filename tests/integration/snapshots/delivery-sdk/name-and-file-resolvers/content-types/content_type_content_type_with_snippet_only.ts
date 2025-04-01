import type { CoreContentType } from '../system/index.js';
import type { Snippet_snippet_a } from '../content-type-snippets/index.js';

/**
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentType_content_type_with_snippet_only = CoreContentType<
    ContentType_content_type_with_snippet_onlyElementCodenames,
    Record<string, never> & Snippet_snippet_a,
    'content_type_with_snippet_only'
>;

/**
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentType_content_type_with_snippet_onlyElementCodenames = 'snippet_a__linked_items_with_specific_types' | 'snippet_a__text';

/**
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentType_content_type_with_snippet_only(
    item: CoreContentType | undefined | null
): item is ContentType_content_type_with_snippet_only {
    return item?.system?.type === 'content_type_with_snippet_only';
}
