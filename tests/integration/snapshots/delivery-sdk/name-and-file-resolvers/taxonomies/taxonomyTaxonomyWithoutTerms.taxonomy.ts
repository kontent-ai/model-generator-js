import type { TaxonomyCodenames } from './_taxonomies.js';

/*
 * Type representing codename of 'Taxonomy without terms' taxonomy
 */
export type TaxonomyTaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Typeguard for codename of 'Taxonomy without terms' taxonomy
 */
export function isTaxonomyTaxonomyWithoutTermsTaxonomyCodename(
	value: string | undefined | null
): value is TaxonomyTaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyTaxonomyWithoutTermsTaxonomyCodename);
}

/*
 * Array of all taxonomy term codenames
 */
export const taxonomyTaxonomyWithoutTermsTermCodenames = [] as const;

/*
 * Type representing all taxonomy term codenames
 */
export type TaxonomyTaxonomyWithoutTermsTermCodenames = (typeof taxonomyTaxonomyWithoutTermsTermCodenames)[number];

/*
 * Typeguard for taxonomy term codename
 */
export function isTaxonomyTaxonomyWithoutTermsTermCodename(
	value: string | undefined | null
): value is TaxonomyTaxonomyWithoutTermsTermCodenames {
	return typeof value === 'string' && (taxonomyTaxonomyWithoutTermsTermCodenames as readonly string[]).includes(value);
}
