/*
 * Array of all element codenames
 */
export const allElementCodenames = [
	"text_element",
	"url_slug_element",
	"rich_text_element",
	"date___time_element",
	"custom_element",
	"linked_items_element",
	"asset_element",
	"multiple_choice_element",
	"number_element",
	"snippet_a__rich_text_with_all_allowed_item_types",
	"snippet_a__linked_items_with_specific_types",
	"snippet_a__text",
	"taxonomy_element",
	"parrot__",
	"_____numberelem_____________________",
	"items",
	"title",
	"subpages",
	"content",
	"url",
	"show_in_navigation",
	"rich_text_with_invalid_type",
	"linked_items_with_invalid_type",
] as const;

/*
 * Type representing all element codenames
 */
export type AnyElementCodename = (typeof allElementCodenames)[number];

/*
 * Typeguard for element codename
 */
export function isAnyElementCodename(value: string | undefined | null): value is AnyElementCodename {
	return typeof value === "string" && (allElementCodenames as readonly string[]).includes(value);
}
