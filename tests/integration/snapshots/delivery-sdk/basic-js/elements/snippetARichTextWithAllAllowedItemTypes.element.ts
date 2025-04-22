import type { ElementCodenames } from './_elements.js';

/**
 * Type representing codename of Rich text with all allowed item types Element
 *
 * Codename: snippet_a__rich_text_with_all_allowed_item_types
 */
export type RichTextWithAllAllowedItemTypesElementCodename = Extract<ElementCodenames, 'snippet_a__rich_text_with_all_allowed_item_types'>;

/**
 * Type guard for Rich text with all allowed item types entity
 *
 * Codename: snippet_a__rich_text_with_all_allowed_item_types
 */
export function isRichTextWithAllAllowedItemTypesElementCodename(
    value: string | undefined | null
): value is RichTextWithAllAllowedItemTypesElementCodename {
    return (
        typeof value === 'string' &&
        value === ('snippet_a__rich_text_with_all_allowed_item_types' satisfies RichTextWithAllAllowedItemTypesElementCodename)
    );
}
