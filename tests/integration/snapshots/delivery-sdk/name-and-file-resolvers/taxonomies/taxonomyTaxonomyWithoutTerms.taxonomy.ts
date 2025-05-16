import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of entity
 *
 * Name: Taxonomy without terms
 * Codename: taxonomy_without_terms
 * Type: Taxonomy
 */
export type TaxonomyTaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Typeguard function for entity
 *
 * Name: Taxonomy without terms
 * Codename: taxonomy_without_terms
 * Type: Taxonomy
 */
export function isTaxonomyTaxonomyWithoutTermsTaxonomyCodename(
	value: string | undefined | null
): value is TaxonomyTaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyTaxonomyWithoutTermsTaxonomyCodename);
}

/*
 * Array of all codenames
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export const taxonomyTaxonomyWithoutTermsTermCodenames = [] as const;

/*
 * Type representing all codenames
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export type TaxonomyTaxonomyWithoutTermsTermCodenames = (typeof taxonomyTaxonomyWithoutTermsTermCodenames)[number];

/*
 * Typeguard for codename
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export function isTaxonomyTaxonomyWithoutTermsTermCodename(
	value: string | undefined | null
): value is TaxonomyTaxonomyWithoutTermsTermCodenames {
	return typeof value === 'string' && (taxonomyTaxonomyWithoutTermsTermCodenames as readonly string[]).includes(value);
}
