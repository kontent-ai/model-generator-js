import type { ElementCodenames } from './_elements.js';

/**
 * Type representing codename of Text element Element
 *
 * Codename: text_element
 */
export type TextElementElementCodename = Extract<ElementCodenames, 'text_element'>;

/**
 * Type guard for Text element entity
 *
 * Codename: text_element
 */
export function isTextElementElementCodename(value: string | undefined | null): value is TextElementElementCodename {
    return typeof value === 'string' && value === ('text_element' satisfies TextElementElementCodename);
}
