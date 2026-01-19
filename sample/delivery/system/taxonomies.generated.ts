
export const taxonomyCodenames = ["movietype", "releasecategory"] as const;

export type TaxonomyCodenames = (typeof taxonomyCodenames)[number];

export function isTaxonomyCodename(value: string | undefined | null): value is TaxonomyCodenames {
	return typeof value === "string" && (taxonomyCodenames as readonly string[]).includes(value);
}
