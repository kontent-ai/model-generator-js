import type { SnippetCodenames } from './_snippets.ts';
import type { Elements, Snippet } from '@kontent-ai/delivery-sdk';
import type { ContentTypeWithAllElementsType } from '../types/index.ts';
import type { CoreType } from '../system/index.ts';

/*
 * Type representing codename of 'Snippet A' snippet
 */
export type SnippetASnippetCodename = Extract<SnippetCodenames, 'snippet_a'>;

/*
 * Typeguard for codename of 'Snippet A' snippet
 */
export function isSnippetASnippetCodename(value: string | undefined | null): value is SnippetASnippetCodename {
	return typeof value === 'string' && value === ('snippet_a' satisfies SnippetASnippetCodename);
}

/*
 * Snippet A
 *
 * Id: b74eb5f6-c851-42f2-9fea-e367d0a3fa61
 * Codename: snippet_a
 */
export type SnippetASnippet = Snippet<
	SnippetASnippetElementCodenames,
	{
		/*
		 * Rich text with all allowed item types
		 *
		 * Codename: snippet_a__rich_text_with_all_allowed_item_types
		 * Id: 72cdc4e7-dead-4baf-99bf-91d8fe62351f
		 * Type: rich_text
		 * Required: false
		 */
		readonly snippet_a__rich_text_with_all_allowed_item_types: Elements.RichTextElement<CoreType>;

		/*
		 * Linked items with specific types
		 *
		 * Codename: snippet_a__linked_items_with_specific_types
		 * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: content_type_with_all_elements
		 */
		readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItemsElement<ContentTypeWithAllElementsType>;

		/*
		 * Text
		 *
		 * Codename: snippet_a__text
		 * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
		 * Type: text
		 * Required: true
		 */
		readonly snippet_a__text: Elements.TextElement;
	}
>;

/*
 * Type representing all available element codenames for Snippet A
 */
export type SnippetASnippetElementCodenames =
	| 'snippet_a__rich_text_with_all_allowed_item_types'
	| 'snippet_a__linked_items_with_specific_types'
	| 'snippet_a__text';
