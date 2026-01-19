
import type { TaxonomyCodenames } from "../system/taxonomies.generated.js";

export type ReleaseCategoryTaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "releasecategory">;

export function isReleaseCategoryTaxonomyCodename(value: string | undefined | null): value is ReleaseCategoryTaxonomyCodename {
	return typeof value === "string" && value === ("releasecategory" satisfies ReleaseCategoryTaxonomyCodename);
}

export const releaseCategoryTaxonomyTermCodenames = ["global_release", "us_only", "local_release"] as const;

export type ReleaseCategoryTaxonomyTermCodenames = (typeof releaseCategoryTaxonomyTermCodenames)[number];

export function isReleaseCategoryTaxonomyTermCodename(value: string | undefined | null): value is ReleaseCategoryTaxonomyTermCodenames {
	return typeof value === "string" && (releaseCategoryTaxonomyTermCodenames as readonly string[]).includes(value);
}
