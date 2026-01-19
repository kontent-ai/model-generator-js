import type { TaxonomyCodenames } from "../system/taxonomies.generated.js";

export type TaxonomyWithoutTermsTaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "taxonomy_without_terms">;

export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
	return typeof value === "string" && value === ("taxonomy_without_terms" satisfies TaxonomyWithoutTermsTaxonomyCodename);
}

export const taxonomyWithoutTermsTaxonomyTermCodenames = [] as const;

export type TaxonomyWithoutTermsTaxonomyTermCodenames = (typeof taxonomyWithoutTermsTaxonomyTermCodenames)[number];

export function isTaxonomyWithoutTermsTaxonomyTermCodename(
	value: string | undefined | null,
): value is TaxonomyWithoutTermsTaxonomyTermCodenames {
	return typeof value === "string" && (taxonomyWithoutTermsTaxonomyTermCodenames as readonly string[]).includes(value);
}
