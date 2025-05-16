import type { TaxonomyCodenames } from './_taxonomies.ts';

/*
 * Type representing codename of 'Taxonomy without terms' taxonomy
 */
export type TaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

/*
 * Typeguard for codename of 'Taxonomy without terms' taxonomy
 */
export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyWithoutTermsTaxonomyCodename);
}

/*
 * Array of all taxonomy term codenames
 */
export const taxonomyWithoutTermsTermCodenames = [] as const;

/*
 * Type representing all taxonomy term codenames
 */
export type TaxonomyWithoutTermsTermCodenames = (typeof taxonomyWithoutTermsTermCodenames)[number];

/*
 * Typeguard for taxonomy term codename
 */
export function isTaxonomyWithoutTermsTermCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTermCodenames {
	return typeof value === 'string' && (taxonomyWithoutTermsTermCodenames as readonly string[]).includes(value);
}
