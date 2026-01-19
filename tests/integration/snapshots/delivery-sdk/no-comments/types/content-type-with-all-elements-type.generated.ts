import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { SnippetASnippet } from "../snippets/snippet-a-snippet.generated.js";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";
import type { TaxonomyATaxonomyCodename, TaxonomyATaxonomyTermCodenames } from "../taxonomies/taxonomy-a-taxonomy.generated.js";

export type ContentTypeWithAllElementsTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_all_elements">;

export function isContentTypeWithAllElementsTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithAllElementsTypeCodename {
	return typeof value === "string" && value === ("content_type_with_all_elements" satisfies ContentTypeWithAllElementsTypeCodename);
}

export type ContentTypeWithAllElementsType = IContentItem<
	{
		readonly text_element: Elements.TextElement;

		readonly url_slug_element: Elements.UrlSlugElement;

		readonly rich_text_element: Elements.RichTextElement<CoreType>;

		readonly date___time_element: Elements.DateTimeElement;

		readonly custom_element: Elements.CustomElement;

		readonly linked_items_element: Elements.LinkedItemsElement<ContentTypeWithAllElementsType>;

		readonly asset_element: Elements.AssetsElement;

		readonly multiple_choice_element: Elements.MultipleChoiceElement<ContentTypeWithAllElementsTypeMultipleChoiceElementMultipleChoiceOptions>;

		readonly number_element: Elements.NumberElement;

		readonly taxonomy_element: Elements.TaxonomyElement<TaxonomyATaxonomyTermCodenames, TaxonomyATaxonomyCodename>;
	} & SnippetASnippet,
	ContentTypeWithAllElementsTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
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

export function isContentTypeWithAllElementsType(item: IContentItem | undefined | null): item is ContentTypeWithAllElementsType {
	return item?.system.type === ("content_type_with_all_elements" satisfies ContentTypeWithAllElementsTypeCodename);
}

export type ContentTypeWithAllElementsTypeMultipleChoiceElementMultipleChoiceOptions = "option_a" | "option_b";
