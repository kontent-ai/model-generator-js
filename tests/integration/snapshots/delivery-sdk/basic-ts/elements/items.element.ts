import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Items Element
 *
 * Codename: items
 */
export type ItemsElementCodename = Extract<ElementCodenames, 'items'>;

/**
 * Type guard for Items entity
 *
 * Codename: items
 */
export function isItemsElementCodename(value: string | undefined | null): value is ItemsElementCodename {
    return typeof value === 'string' && value === ('items' satisfies ItemsElementCodename);
}
