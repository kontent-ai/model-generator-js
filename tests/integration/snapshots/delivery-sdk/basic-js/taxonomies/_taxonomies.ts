/*
 * Array of all codenames
 *
 * Type: Taxonomy
 */
export const taxonomyCodenames = ['taxonomy_a', 'taxonomy_without_terms'] as const;

/*
 * Type representing all codenames
 *
 * Type: Taxonomy
 */
export type TaxonomyCodenames = (typeof taxonomyCodenames)[number];

/*
 * Typeguard for codename
 *
 * Type: Taxonomy
 */
export function isTaxonomyCodename(value: string | undefined | null): value is TaxonomyCodenames {
	return typeof value === 'string' && (taxonomyCodenames as readonly string[]).includes(value);
}
