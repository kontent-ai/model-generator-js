import type { MigrationElementModels } from "@kontent-ai/migration-toolkit"
import type { CoreMigrationItem } from "../migration.js"

/*
 * Content type with all elements
 *
 * Codename: content_type_with_all_elements
 * Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
 */
export type ContentTypeWithAllElementsItem = CoreMigrationItem<
	"content_type_with_all_elements",
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
		readonly text_element: MigrationElementModels.TextElement

		/*
		 * Url slug element
		 *
		 * Codename: url_slug_element
		 * Id: e117d1ae-d985-4df2-b6c7-b3aa03521a00
		 * Type: url_slug
		 * Required: false
		 */
		readonly url_slug_element: MigrationElementModels.UrlSlugElement

		/*
		 * Rich text element
		 *
		 * Codename: rich_text_element
		 * Id: 81ee0883-8c1b-49cc-8d11-2fd1dcf75c5c
		 * Type: rich_text
		 * Required: false
		 */
		readonly rich_text_element: MigrationElementModels.RichTextElement

		/*
		 * Date & time element
		 *
		 * Codename: date___time_element
		 * Id: 38d5d709-4152-445c-b1ef-333147bd656e
		 * Type: date_time
		 * Required: false
		 */
		readonly date___time_element: MigrationElementModels.DateTimeElement

		/*
		 * Custom element
		 *
		 * Codename: custom_element
		 * Id: 768581f2-7b56-4be3-a8a2-a1850dbe493e
		 * Type: custom
		 * Required: false
		 */
		readonly custom_element: MigrationElementModels.CustomElement

		/*
		 * Linked items element
		 *
		 * Codename: linked_items_element
		 * Id: 4631c94d-034c-428a-88bb-cae6d7985ff5
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: content_type_with_all_elements
		 */
		readonly linked_items_element: MigrationElementModels.LinkedItemsElement

		/*
		 * Asset element
		 *
		 * Codename: asset_element
		 * Id: fc99d625-106b-4f95-b37e-7f7be358d3d1
		 * Type: asset
		 * Required: false
		 */
		readonly asset_element: MigrationElementModels.AssetElement

		/*
		 * Multiple choice element
		 *
		 * Codename: multiple_choice_element
		 * Id: 709148dd-8c3f-4660-95b8-a72f386dd367
		 * Type: multiple_choice
		 * Required: false
		 */
		readonly multiple_choice_element: MigrationElementModels.MultipleChoiceElement

		/*
		 * Number element
		 *
		 * Codename: number_element
		 * Id: 7416ea32-3d33-45bb-bf2a-2226f658e953
		 * Type: number
		 * Required: false
		 */
		readonly number_element: MigrationElementModels.NumberElement

		/*
		 * Rich text with all allowed item types
		 *
		 * Codename: snippet_a__rich_text_with_all_allowed_item_types
		 * Id: 72cdc4e7-dead-4baf-99bf-91d8fe62351f
		 * Type: rich_text
		 * Required: false
		 * From snippet: snippet_a
		 */
		readonly snippet_a__rich_text_with_all_allowed_item_types: MigrationElementModels.RichTextElement

		/*
		 * Linked items with specific types
		 *
		 * Codename: snippet_a__linked_items_with_specific_types
		 * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
		 * Type: modular_content
		 * Required: false
		 * From snippet: snippet_a
		 * Allowed content types: content_type_with_all_elements
		 */
		readonly snippet_a__linked_items_with_specific_types: MigrationElementModels.LinkedItemsElement

		/*
		 * Text
		 *
		 * Codename: snippet_a__text
		 * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
		 * Type: text
		 * Required: true
		 * From snippet: snippet_a
		 */
		readonly snippet_a__text: MigrationElementModels.TextElement

		/*
		 * Taxonomy A
		 *
		 * Codename: taxonomy_element
		 * Id: 6073dec8-2489-479f-9916-abc055126e59
		 * Type: taxonomy
		 * Required: false
		 * Taxonomy: taxonomy_a
		 */
		readonly taxonomy_element: MigrationElementModels.TaxonomyElement
	}
>
