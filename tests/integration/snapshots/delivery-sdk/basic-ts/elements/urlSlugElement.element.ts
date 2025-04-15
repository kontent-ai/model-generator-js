import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Url slug element Element
 *
 * Codename: url_slug_element
 */
export type UrlSlugElementElementCodename = Extract<ElementCodenames, 'url_slug_element'>;

/**
 * Type guard for Url slug element entity
 *
 * Codename: url_slug_element
 */
export function isUrlSlugElementElementCodename(value: string | undefined | null): value is UrlSlugElementElementCodename {
    return typeof value === 'string' && value === ('url_slug_element' satisfies UrlSlugElementElementCodename);
}
