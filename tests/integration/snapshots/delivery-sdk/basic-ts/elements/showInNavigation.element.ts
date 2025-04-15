import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Show in navigation Element
 *
 * Codename: show_in_navigation
 */
export type ShowInNavigationElementCodename = Extract<ElementCodenames, 'show_in_navigation'>;

/**
 * Type guard for Show in navigation entity
 *
 * Codename: show_in_navigation
 */
export function isShowInNavigationElementCodename(value: string | undefined | null): value is ShowInNavigationElementCodename {
    return typeof value === 'string' && value === ('show_in_navigation' satisfies ShowInNavigationElementCodename);
}
