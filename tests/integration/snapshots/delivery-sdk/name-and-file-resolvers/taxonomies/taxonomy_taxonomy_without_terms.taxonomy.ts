import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 */
export type Taxonomy_taxonomy_without_termsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Type guard for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 */
export function isTaxonomy_taxonomy_without_termsTaxonomyCodename(
	value: string | undefined | null
): value is Taxonomy_taxonomy_without_termsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies Taxonomy_taxonomy_without_termsTaxonomyCodename);
}

/*
 * Object with all values of taxonomy term codenames in Taxonomy without terms
 */
export const taxonomyTaxonomyWithoutTermsTaxonomyTermCodenames = [] as const;

/*
 * Type representing taxonomy term codenames in Taxonomy without terms
 */
export type TaxonomyTaxonomyWithoutTermsTaxonomyTermCodenames = (typeof taxonomyTaxonomyWithoutTermsTaxonomyTermCodenames)[number];

/*
 * Type guard for taxonomy term codenames in Taxonomy without terms
 */
export function isTaxonomyTaxonomyWithoutTermsTaxonomyTermCodename(
	value: string | undefined | null
): value is TaxonomyTaxonomyWithoutTermsTaxonomyTermCodenames {
	return typeof value === 'string' && (taxonomyTaxonomyWithoutTermsTaxonomyTermCodenames as readonly string[]).includes(value);
}
