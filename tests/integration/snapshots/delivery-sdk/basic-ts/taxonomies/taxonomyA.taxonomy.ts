import type { TaxonomyCodenames } from './_taxonomies.ts';

/*
 * Type representing codename of 'Taxonomy A' taxonomy
 */
export type TaxonomyATaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

/*
 * Typeguard for codename of 'Taxonomy A' taxonomy
 */
export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyATaxonomyCodename);
}

/*
 * Array of all taxonomy term codenames
 */
export const taxonomyATermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/*
 * Type representing all taxonomy term codenames
 */
export type TaxonomyATermCodenames = (typeof taxonomyATermCodenames)[number];

/*
 * Typeguard for taxonomy term codename
 */
export function isTaxonomyATermCodename(value: string | undefined | null): value is TaxonomyATermCodenames {
	return typeof value === 'string' && (taxonomyATermCodenames as readonly string[]).includes(value);
}
