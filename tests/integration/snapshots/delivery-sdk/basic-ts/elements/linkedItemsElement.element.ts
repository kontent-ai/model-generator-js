import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Linked items element Element
 *
 * Codename: linked_items_element
 */
export type LinkedItemsElementElementCodename = Extract<ElementCodenames, 'linked_items_element'>;

/**
 * Type guard for Linked items element entity
 *
 * Codename: linked_items_element
 */
export function isLinkedItemsElementElementCodename(value: string | undefined | null): value is LinkedItemsElementElementCodename {
    return typeof value === 'string' && value === ('linked_items_element' satisfies LinkedItemsElementElementCodename);
}
