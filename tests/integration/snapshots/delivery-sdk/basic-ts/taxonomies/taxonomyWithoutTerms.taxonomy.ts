import type { TaxonomyCodenames } from './_taxonomies.ts';

/*
 * Type representing codename of entity
 *
 * Name: Taxonomy without terms
 * Codename: taxonomy_without_terms
 * Type: Taxonomy
 */
export type TaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Type guard for Taxonomy without terms
 *
 * Name: Taxonomy without terms
 * Codename: taxonomy_without_terms
 * Type: Taxonomy
 */
export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyWithoutTermsTaxonomyCodename);
}

/*
 * Array of all codenames
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export const taxonomyWithoutTermsTermCodenames = [] as const;

/*
 * Type representing all codenames
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export type TaxonomyWithoutTermsTermCodenames = (typeof taxonomyWithoutTermsTermCodenames)[number];

/*
 * Typeguard for codename
 *
 * Name: Taxonomy without terms
 * Type: Taxonomy term
 */
export function isTaxonomyWithoutTermsTermCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTermCodenames {
	return typeof value === 'string' && (taxonomyWithoutTermsTermCodenames as readonly string[]).includes(value);
}
