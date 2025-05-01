import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of Taxonomy A
 *
 * Codename: taxonomy_a
 */
export type TaxonomyATaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

/*
 * Type guard for Taxonomy A
 *
 * Codename: taxonomy_a
 */
export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyATaxonomyCodename);
}

/*
 * Object with all values of taxonomy term codenames in Taxonomy A
 */
export const taxonomyATaxonomyTermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/*
 * Type representing taxonomy term codenames in Taxonomy A
 */
export type TaxonomyATaxonomyTermCodenames = (typeof taxonomyATaxonomyTermCodenames)[number];

/*
 * Type guard for taxonomy term codenames in Taxonomy A
 */
export function isTaxonomyATaxonomyTermCodename(value: string | undefined | null): value is TaxonomyATaxonomyTermCodenames {
	return typeof value === 'string' && (taxonomyATaxonomyTermCodenames as readonly string[]).includes(value);
}
