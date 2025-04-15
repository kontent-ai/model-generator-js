import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Custom element Element
 *
 * Codename: custom_element
 */
export type CustomElementElementCodename = Extract<ElementCodenames, 'custom_element'>;

/**
 * Type guard for Custom element entity
 *
 * Codename: custom_element
 */
export function isCustomElementElementCodename(value: string | undefined | null): value is CustomElementElementCodename {
    return typeof value === 'string' && value === ('custom_element' satisfies CustomElementElementCodename);
}
