
export const elementCodenames = [
	"url",
	"first_name",
	"last_name",
	"photo",
	"title",
	"plot",
	"released",
	"length",
	"poster",
	"category",
	"stars",
	"seoname",
	"releasecategory",
] as const;

export type ElementCodenames = (typeof elementCodenames)[number];

export function isElementCodename(value: string | undefined | null): value is ElementCodenames {
	return typeof value === "string" && (elementCodenames as readonly string[]).includes(value);
}
