import type { TaxonomyCodenames } from './_taxonomies.ts';

/*
 * Type representing codename of Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 */
export type TaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Type guard for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 */
export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyWithoutTermsTaxonomyCodename);
}

/*
 * Object with all values of taxonomy term codenames in Taxonomy without terms
 */
export const taxonomyWithoutTermsTaxonomyTermCodenames = [] as const;

/*
 * Type representing taxonomy term codenames in Taxonomy without terms
 */
export type TaxonomyWithoutTermsTaxonomyTermCodenames = (typeof taxonomyWithoutTermsTaxonomyTermCodenames)[number];

/*
 * Type guard for taxonomy term codenames in Taxonomy without terms
 */
export function isTaxonomyWithoutTermsTaxonomyTermCodename(
	value: string | undefined | null
): value is TaxonomyWithoutTermsTaxonomyTermCodenames {
	return typeof value === 'string' && (taxonomyWithoutTermsTaxonomyTermCodenames as readonly string[]).includes(value);
}
