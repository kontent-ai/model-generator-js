import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Linked items with specific types Element
 *
 * Codename: snippet_a__linked_items_with_specific_types
 */
export type LinkedItemsWithSpecificTypesElementCodename = Extract<ElementCodenames, 'snippet_a__linked_items_with_specific_types'>;

/**
 * Type guard for Linked items with specific types entity
 *
 * Codename: snippet_a__linked_items_with_specific_types
 */
export function isLinkedItemsWithSpecificTypesElementCodename(
    value: string | undefined | null
): value is LinkedItemsWithSpecificTypesElementCodename {
    return (
        typeof value === 'string' &&
        value === ('snippet_a__linked_items_with_specific_types' satisfies LinkedItemsWithSpecificTypesElementCodename)
    );
}
