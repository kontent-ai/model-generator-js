import type { ElementCodenames } from './_elements.js';

/**
 * Type representing codename of Title Element
 *
 * Codename: title
 */
export type TitleElementCodename = Extract<ElementCodenames, 'title'>;

/**
 * Type guard for Title entity
 *
 * Codename: title
 */
export function isTitleElementCodename(value: string | undefined | null): value is TitleElementCodename {
    return typeof value === 'string' && value === ('title' satisfies TitleElementCodename);
}
