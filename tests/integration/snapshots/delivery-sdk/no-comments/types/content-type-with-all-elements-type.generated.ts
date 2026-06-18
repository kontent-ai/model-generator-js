import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { TaxonomyATaxonomyTermCodenames } from "../taxonomies/taxonomy-a-taxonomy.generated.js";

export type ContentTypeWithAllElementsTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_all_elements">;

export function isContentTypeWithAllElementsTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithAllElementsTypeCodename {
	return typeof value === "string" && value === ("content_type_with_all_elements" satisfies ContentTypeWithAllElementsTypeCodename);
}

export type ContentTypeWithAllElementsType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithAllElementsTypeCodename,
	{
		readonly text_element: Elements.Text;

		readonly url_slug_element: Elements.UrlSlug;

		readonly rich_text_element: Elements.RichText<CoreType>;

		readonly date___time_element: Elements.DateTime;

		readonly custom_element: Elements.Custom;

		readonly linked_items_element: Elements.LinkedItems<ContentTypeWithAllElementsType>;

		readonly asset_element: Elements.Asset;

		readonly multiple_choice_element: Elements.MultipleChoice<ContentTypeWithAllElementsTypeMultipleChoiceElementMultipleChoiceOptions>;

		readonly number_element: Elements.Number;

		readonly taxonomy_element: Elements.Taxonomy<TaxonomyATaxonomyTermCodenames>;
	} & SnippetASnippet["elements"]
>;

export type ContentTypeWithAllElementsTypeElementCodenames =
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

export function isContentTypeWithAllElementsType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithAllElementsType {
	return isContentTypeWithAllElementsTypeCodename(item?.system.type);
}

export type ContentTypeWithAllElementsTypeMultipleChoiceElementMultipleChoiceOptions = "option_a" | "option_b";
