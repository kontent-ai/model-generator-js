import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of Taxonomy A
 *
 * Codename: taxonomy_a
 */
export type Taxonomy_taxonomy_aTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

/*
 * Type guard for Taxonomy A
 *
 * Codename: taxonomy_a
 */
export function isTaxonomy_taxonomy_aTaxonomyCodename(value: string | undefined | null): value is Taxonomy_taxonomy_aTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_a' satisfies Taxonomy_taxonomy_aTaxonomyCodename);
}

/*
 * Object with all values of taxonomy term codenames in Taxonomy A
 */
export const taxonomyTaxonomyATaxonomyTermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/*
 * Type representing taxonomy term codenames in Taxonomy A
 */
export type TaxonomyTaxonomyATaxonomyTermCodenames = (typeof taxonomyTaxonomyATaxonomyTermCodenames)[number];

/*
 * Type guard for taxonomy term codenames in Taxonomy A
 */
export function isTaxonomyTaxonomyATaxonomyTermCodename(value: string | undefined | null): value is TaxonomyTaxonomyATaxonomyTermCodenames {
	return typeof value === 'string' && (taxonomyTaxonomyATaxonomyTermCodenames as readonly string[]).includes(value);
}
