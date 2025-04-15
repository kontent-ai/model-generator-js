import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Text Element
 *
 * Codename: snippet_a__text
 */
export type TextElementCodename = Extract<ElementCodenames, 'snippet_a__text'>;

/**
 * Type guard for Text entity
 *
 * Codename: snippet_a__text
 */
export function isTextElementCodename(value: string | undefined | null): value is TextElementCodename {
    return typeof value === 'string' && value === ('snippet_a__text' satisfies TextElementCodename);
}
