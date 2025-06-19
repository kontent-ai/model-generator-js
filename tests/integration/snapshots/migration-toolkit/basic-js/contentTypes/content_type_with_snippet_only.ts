import type { MigrationElementModels } from "@kontent-ai/migration-toolkit"
import type { CoreMigrationItem } from "../migration.js"

/*
 * Content type with snippet only
 *
 * Codename: content_type_with_snippet_only
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 */
export type ContentTypeWithSnippetOnlyItem = CoreMigrationItem<
	"content_type_with_snippet_only",
	{
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
	}
>
