import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreItem, TypeCodenames } from "../system/types.generated.js";
import type { TaxonomyATaxonomyTermCodenames } from "../taxonomies/taxonomy-a-taxonomy.generated.js";

export type ContentTypeWithAllElementsCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_all_elements">;

export function isContentTypeWithAllElementsCodename(value: string | undefined | null): value is ContentTypeWithAllElementsCodename {
	return typeof value === "string" && value === ("content_type_with_all_elements" satisfies ContentTypeWithAllElementsCodename);
}

export type ContentTypeWithAllElementsItem = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithAllElementsCodename,
	{
		readonly text_element: Elements.Text;

		readonly url_slug_element: Elements.UrlSlug;

		readonly rich_text_element: Elements.RichText<CoreItem>;

		readonly date___time_element: Elements.DateTime;

		readonly custom_element: Elements.Custom;

		readonly linked_items_element: Elements.LinkedItems<ContentTypeWithAllElementsItem>;

		readonly asset_element: Elements.Asset;

		readonly multiple_choice_element: Elements.MultipleChoice<ContentTypeWithAllElementsMultipleChoiceElementMultipleChoiceOptions>;

		readonly number_element: Elements.Number;

		readonly taxonomy_element: Elements.Taxonomy<TaxonomyATaxonomyTermCodenames>;
	} & SnippetASnippet["elements"]
>;

export type ContentTypeWithAllElementsElementCodenames =
	| "text_element"
	| "url_slug_element"
	| "rich_text_element"
	| "date___time_element"
	| "custom_element"
	| "linked_items_element"
	| "asset_element"
	| "multiple_choice_element"
	| "number_element"
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text"
	| "taxonomy_element";

export function isContentTypeWithAllElementsItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithAllElementsItem {
	return isContentTypeWithAllElementsCodename(item?.system.type);
}

export type ContentTypeWithAllElementsMultipleChoiceElementMultipleChoiceOptions = "option_a" | "option_b";
