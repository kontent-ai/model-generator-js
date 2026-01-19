import type { TaxonomyCodenames } from "../system/taxonomies.generated.js";

export type TaxonomyATaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "taxonomy_a">;

export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
	return typeof value === "string" && value === ("taxonomy_a" satisfies TaxonomyATaxonomyCodename);
}

export const taxonomyATaxonomyTermCodenames = ["nested_term_2", "nested_term_1", "term_1", "term_2", "term_3"] as const;

export type TaxonomyATaxonomyTermCodenames = (typeof taxonomyATaxonomyTermCodenames)[number];

export function isTaxonomyATaxonomyTermCodename(value: string | undefined | null): value is TaxonomyATaxonomyTermCodenames {
	return typeof value === "string" && (taxonomyATaxonomyTermCodenames as readonly string[]).includes(value);
}
