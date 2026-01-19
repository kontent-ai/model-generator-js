
import type { TaxonomyCodenames } from "../system/taxonomies.generated.js";

export type MovieTypeTaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "movietype">;

export function isMovieTypeTaxonomyCodename(value: string | undefined | null): value is MovieTypeTaxonomyCodename {
	return typeof value === "string" && value === ("movietype" satisfies MovieTypeTaxonomyCodename);
}

export const movieTypeTaxonomyTermCodenames = ["student", "tv", "blockbuster", "cinema_only", "film"] as const;

export type MovieTypeTaxonomyTermCodenames = (typeof movieTypeTaxonomyTermCodenames)[number];

export function isMovieTypeTaxonomyTermCodename(value: string | undefined | null): value is MovieTypeTaxonomyTermCodenames {
	return typeof value === "string" && (movieTypeTaxonomyTermCodenames as readonly string[]).includes(value);
}
