import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of URL Element
 *
 * Codename: url
 */
export type URLElementCodename = Extract<ElementCodenames, 'url'>;

/**
 * Type guard for URL entity
 *
 * Codename: url
 */
export function isURLElementCodename(value: string | undefined | null): value is URLElementCodename {
    return typeof value === 'string' && value === ('url' satisfies URLElementCodename);
}
