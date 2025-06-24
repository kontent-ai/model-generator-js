import type { TaxonomyCodenames } from "./_taxonomies.generated.js"

/*
 * Type representing codename of 'Taxonomy without terms' taxonomy
 */
export type TaxonomyWithoutTermsTaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "taxonomy_without_terms">

/*
 * Typeguard for codename of 'Taxonomy without terms' taxonomy
 */
export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === "string" && value === ("taxonomy_without_terms" satisfies TaxonomyWithoutTermsTaxonomyCodename)
}

/*
 * Array of all taxonomy term codenames
 */
export const taxonomyWithoutTermsTaxonomyTermCodenames = [] as const

/*
 * Type representing all taxonomy term codenames
 */
export type TaxonomyWithoutTermsTaxonomyTermCodenames = (typeof taxonomyWithoutTermsTaxonomyTermCodenames)[number]

/*
 * Typeguard for taxonomy term codename
 */
export function isTaxonomyWithoutTermsTaxonomyTermCodename(
	value: string | undefined | null
): value is TaxonomyWithoutTermsTaxonomyTermCodenames {
	return typeof value === "string" && (taxonomyWithoutTermsTaxonomyTermCodenames as readonly string[]).includes(value)
}
