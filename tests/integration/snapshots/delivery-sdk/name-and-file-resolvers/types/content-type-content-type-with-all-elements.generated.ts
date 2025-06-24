import type { TypeCodenames } from "./_types.generated.js"
import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CoreType } from "../system/main.system.generated.js"
import type { SnippetSnippetA } from "../snippets/snippet-snippet-a.generated.js"
import type { TaxonomyTaxonomyATermCodenames, TaxonomyTaxonomyACodename } from "../taxonomies/taxonomy-taxonomy-a.generated.js"

/*
 * Type representing codename of 'Content type with all elements' type
 */
export type ContentTypeContentTypeWithAllElementsCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_all_elements">

/*
 * Typeguard for codename of 'Content type with all elements' type
 */
export function isContentTypeContentTypeWithAllElementsCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithAllElementsCodename {
	return typeof value === "string" && value === ("content_type_with_all_elements" satisfies ContentTypeContentTypeWithAllElementsCodename)
}

/*
 * Content type with all elements
 *
 * Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
 * Codename: content_type_with_all_elements
 */
export type ContentTypeContentTypeWithAllElements = CoreType<
	ContentTypeContentTypeWithAllElementsElementCodenames,
	{
		/*
		 * Text element
		 *
		 * Codename: text_element
		 * Id: cf24e550-3bbe-4e9d-aee6-e81b9b490228
		 * Type: text
		 * Required: true
		 * Guidelines: Simple text element guidelines
		 */
		readonly text_element: Elements.TextElement

		/*
		 * Url slug element
		 *
		 * Codename: url_slug_element
		 * Id: e117d1ae-d985-4df2-b6c7-b3aa03521a00
		 * Type: url_slug
		 * Required: false
		 */
		readonly url_slug_element: Elements.UrlSlugElement

		/*
		 * Rich text element
		 *
		 * Codename: rich_text_element
		 * Id: 81ee0883-8c1b-49cc-8d11-2fd1dcf75c5c
		 * Type: rich_text
		 * Required: false
		 */
		readonly rich_text_element: Elements.RichTextElement<CoreType>

		/*
		 * Date & time element
		 *
		 * Codename: date___time_element
		 * Id: 38d5d709-4152-445c-b1ef-333147bd656e
		 * Type: date_time
		 * Required: false
		 */
		readonly date___time_element: Elements.DateTimeElement

		/*
		 * Custom element
		 *
		 * Codename: custom_element
		 * Id: 768581f2-7b56-4be3-a8a2-a1850dbe493e
		 * Type: custom
		 * Required: false
		 */
		readonly custom_element: Elements.CustomElement

		/*
		 * Linked items element
		 *
		 * Codename: linked_items_element
		 * Id: 4631c94d-034c-428a-88bb-cae6d7985ff5
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: content_type_with_all_elements
		 */
		readonly linked_items_element: Elements.LinkedItemsElement<ContentTypeContentTypeWithAllElements>

		/*
		 * Asset element
		 *
		 * Codename: asset_element
		 * Id: fc99d625-106b-4f95-b37e-7f7be358d3d1
		 * Type: asset
		 * Required: false
		 */
		readonly asset_element: Elements.AssetsElement

		/*
		 * Multiple choice element
		 *
		 * Codename: multiple_choice_element
		 * Id: 709148dd-8c3f-4660-95b8-a72f386dd367
		 * Type: multiple_choice
		 * Required: false
		 */
		readonly multiple_choice_element: Elements.MultipleChoiceElement<ContentTypeContentTypeWithAllElementsMultipleChoiceElementMultipleChoiceOptions>

		/*
		 * Number element
		 *
		 * Codename: number_element
		 * Id: 7416ea32-3d33-45bb-bf2a-2226f658e953
		 * Type: number
		 * Required: false
		 */
		readonly number_element: Elements.NumberElement

		/*
		 * Taxonomy A
		 *
		 * Codename: taxonomy_element
		 * Id: 6073dec8-2489-479f-9916-abc055126e59
		 * Type: taxonomy
		 * Required: false
		 * Taxonomy: taxonomy_a
		 */
		readonly taxonomy_element: Elements.TaxonomyElement<TaxonomyTaxonomyATermCodenames, TaxonomyTaxonomyACodename>
	} & SnippetSnippetA,
	ContentTypeContentTypeWithAllElementsCodename
>

/*
 * Type representing all available element codenames for Content type with all elements
 */
export type ContentTypeContentTypeWithAllElementsElementCodenames =
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
	| "taxonomy_element"

/*
 * Type guard for Content type with all elements
 *
 * Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
 * Codename: content_type_with_all_elements
 */
export function isContentTypeContentTypeWithAllElements(
	item: IContentItem | undefined | null
): item is ContentTypeContentTypeWithAllElements {
	return item?.system.type === ("content_type_with_all_elements" satisfies ContentTypeContentTypeWithAllElementsCodename)
}

export type ContentTypeContentTypeWithAllElementsMultipleChoiceElementMultipleChoiceOptions = "option_a" | "option_b"
