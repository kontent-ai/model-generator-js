import type { CoreItem } from '../system/index.js';
import type { SnippetA } from '../itemSnippets/index.js';

/**
 * Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export type ContentTypeWithSnippetOnly = CoreItem<
    ContentTypeWithSnippetOnlyElementCodenames,
    Record<string, never> & SnippetA,
    'content_type_with_snippet_only'
>;

/**
 * Type representing all available element codenames for Content type with snippet only
 */
export type ContentTypeWithSnippetOnlyElementCodenames = 'snippet_a__linked_items_with_specific_types' | 'snippet_a__text';

/**
 * Type guard for Content type with snippet only
 *
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 * Codename: content_type_with_snippet_only
 */
export function isContentTypeWithSnippetOnlyItem(item: CoreItem | undefined | null): item is ContentTypeWithSnippetOnly {
    return item?.system?.type === 'content_type_with_snippet_only';
}
