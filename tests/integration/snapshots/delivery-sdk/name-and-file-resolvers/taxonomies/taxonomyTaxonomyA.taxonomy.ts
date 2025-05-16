import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of entity
 *
 * Name: Taxonomy A
 * Codename: taxonomy_a
 * Type: Taxonomy
 */
export type TaxonomyTaxonomyATaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

/*
 * Typeguard function for entity
 *
 * Name: Taxonomy A
 * Codename: taxonomy_a
 * Type: Taxonomy
 */
export function isTaxonomyTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyTaxonomyATaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyTaxonomyATaxonomyCodename);
}

/*
 * Array of all codenames
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export const taxonomyTaxonomyATermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/*
 * Type representing all codenames
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export type TaxonomyTaxonomyATermCodenames = (typeof taxonomyTaxonomyATermCodenames)[number];

/*
 * Typeguard for codename
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export function isTaxonomyTaxonomyATermCodename(value: string | undefined | null): value is TaxonomyTaxonomyATermCodenames {
	return typeof value === 'string' && (taxonomyTaxonomyATermCodenames as readonly string[]).includes(value);
}
