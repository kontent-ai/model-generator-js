import type { TaxonomyCodenames } from "./_taxonomies.js"

/*
 * Type representing codename of 'Taxonomy A' taxonomy
 */
export type TaxonomyTaxonomyACodename = keyof Pick<Record<TaxonomyCodenames, null>, "taxonomy_a">

/*
 * Typeguard for codename of 'Taxonomy A' taxonomy
 */
export function isTaxonomyTaxonomyACodename(value: string | undefined | null): value is TaxonomyTaxonomyACodename {
	return typeof value === "string" && value === ("taxonomy_a" satisfies TaxonomyTaxonomyACodename)
}

/*
 * Array of all taxonomy term codenames
 */
export const taxonomyTaxonomyATermCodenames = ["nested_term_2", "nested_term_1", "term_1", "term_2", "term_3"] as const

/*
 * Type representing all taxonomy term codenames
 */
export type TaxonomyTaxonomyATermCodenames = (typeof taxonomyTaxonomyATermCodenames)[number]

/*
 * Typeguard for taxonomy term codename
 */
export function isTaxonomyTaxonomyATermCodename(value: string | undefined | null): value is TaxonomyTaxonomyATermCodenames {
	return typeof value === "string" && (taxonomyTaxonomyATermCodenames as readonly string[]).includes(value)
}
