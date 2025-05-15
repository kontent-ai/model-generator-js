import type { TaxonomyCodenames } from './_taxonomies.ts';

/*
 * Type representing codename of entity
 *
 * Name: Taxonomy A
 * Codename: taxonomy_a
 * Type: Taxonomy
 */
export type TaxonomyATaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

/*
 * Type guard for Taxonomy A
 *
 * Name: Taxonomy A
 * Codename: taxonomy_a
 * Type: Taxonomy
 */
export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
	return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyATaxonomyCodename);
}

/*
 * Array of all codenames
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export const taxonomyATermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/*
 * Type representing all codenames
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export type TaxonomyATermCodenames = (typeof taxonomyATermCodenames)[number];

/*
 * Typeguard for codename
 *
 * Name: Taxonomy A
 * Type: Taxonomy term
 */
export function isTaxonomyATermCodename(value: string | undefined | null): value is TaxonomyATermCodenames {
	return typeof value === 'string' && (taxonomyATermCodenames as readonly string[]).includes(value);
}
