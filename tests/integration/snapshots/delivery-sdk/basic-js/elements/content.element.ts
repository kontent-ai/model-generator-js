import type { ElementCodenames } from './_elements.js';

/**
 * Type representing codename of Content Element
 *
 * Codename: content
 */
export type ContentElementCodename = Extract<ElementCodenames, 'content'>;

/**
 * Type guard for Content entity
 *
 * Codename: content
 */
export function isContentElementCodename(value: string | undefined | null): value is ContentElementCodename {
    return typeof value === 'string' && value === ('content' satisfies ContentElementCodename);
}
