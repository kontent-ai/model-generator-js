export const taxonomyCodenames = ["taxonomy_a", "taxonomy_without_terms"] as const;

export type TaxonomyCodenames = (typeof taxonomyCodenames)[number];

export function isTaxonomyCodename(value: string | undefined | null): value is TaxonomyCodenames {
	return typeof value === "string" && (taxonomyCodenames as readonly string[]).includes(value);
}
