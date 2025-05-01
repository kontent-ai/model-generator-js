import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.ts';

/*
 * Content type with all elements
 *
 * Codename: content_type_with_all_elements
 * Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
 */
export type ContentTypeWithAllElementsItem = CoreMigrationItem<
	'content_type_with_all_elements',
	{
		/*
		 * Text element
		 *
		 * Type: text
		 * Required: true
		 * Codename: text_element
		 * Id: cf24e550-3bbe-4e9d-aee6-e81b9b490228
		 * Guidelines: Simple text element guidelines
		 */
		readonly text_element: MigrationElementModels.TextElement;

		/*
		 * Url slug element
		 *
		 * Type: url_slug
		 * Required: false
		 * Codename: url_slug_element
		 * Id: e117d1ae-d985-4df2-b6c7-b3aa03521a00
		 */
		readonly url_slug_element: MigrationElementModels.UrlSlugElement;

		/*
		 * Rich text element
		 *
		 * Type: rich_text
		 * Required: false
		 * Codename: rich_text_element
		 * Id: 81ee0883-8c1b-49cc-8d11-2fd1dcf75c5c
		 */
		readonly rich_text_element: MigrationElementModels.RichTextElement;

		/*
		 * Date & time element
		 *
		 * Type: date_time
		 * Required: false
		 * Codename: date___time_element
		 * Id: 38d5d709-4152-445c-b1ef-333147bd656e
		 */
		readonly date___time_element: MigrationElementModels.DateTimeElement;

		/*
		 * Custom element
		 *
		 * Type: custom
		 * Required: false
		 * Codename: custom_element
		 * Id: 768581f2-7b56-4be3-a8a2-a1850dbe493e
		 */
		readonly custom_element: MigrationElementModels.CustomElement;

		/*
		 * Linked items element
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: linked_items_element
		 * Id: 4631c94d-034c-428a-88bb-cae6d7985ff5
		 */
		readonly linked_items_element: MigrationElementModels.LinkedItemsElement;

		/*
		 * Asset element
		 *
		 * Type: asset
		 * Required: false
		 * Codename: asset_element
		 * Id: fc99d625-106b-4f95-b37e-7f7be358d3d1
		 */
		readonly asset_element: MigrationElementModels.AssetElement;

		/*
		 * Multiple choice element
		 *
		 * Type: multiple_choice
		 * Required: false
		 * Codename: multiple_choice_element
		 * Id: 709148dd-8c3f-4660-95b8-a72f386dd367
		 */
		readonly multiple_choice_element: MigrationElementModels.MultipleChoiceElement;

		/*
		 * Number element
		 *
		 * Type: number
		 * Required: false
		 * Codename: number_element
		 * Id: 7416ea32-3d33-45bb-bf2a-2226f658e953
		 */
		readonly number_element: MigrationElementModels.NumberElement;

		/*
		 * Rich text with all allowed item types
		 *
		 * Type: rich_text
		 * Required: false
		 * Codename: snippet_a__rich_text_with_all_allowed_item_types
		 * Id: 72cdc4e7-dead-4baf-99bf-91d8fe62351f
		 */
		readonly snippet_a__rich_text_with_all_allowed_item_types: MigrationElementModels.RichTextElement;

		/*
		 * Linked items with specific types
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: snippet_a__linked_items_with_specific_types
		 * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
		 */
		readonly snippet_a__linked_items_with_specific_types: MigrationElementModels.LinkedItemsElement;

		/*
		 * Text
		 *
		 * Type: text
		 * Required: true
		 * Codename: snippet_a__text
		 * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
		 */
		readonly snippet_a__text: MigrationElementModels.TextElement;

		/*
		 * Taxonomy A
		 *
		 * Type: taxonomy
		 * Required: false
		 * Codename: taxonomy_element
		 * Id: 6073dec8-2489-479f-9916-abc055126e59
		 */
		readonly taxonomy_element: MigrationElementModels.TaxonomyElement;
	}
>;
