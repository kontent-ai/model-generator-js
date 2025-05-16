
            import type { SnippetCodenames } from './_snippets.js';
import type { Elements, Snippet } from '@kontent-ai/delivery-sdk';
import type { ContentTypeWithAllElementsType } from '../types/index.js';
import type { CoreType } from '../system/index.js';
           
            /*
    * Type representing codename of entity
    *
    * Name: Snippet A
* Codename: snippet_a
* Type: Snippet
    */
            export type SnippetASnippetCodename = Extract<SnippetCodenames, 'snippet_a'>;

            /*
    * Typeguard function for entity
    *
    * Name: Snippet A
* Codename: snippet_a
* Type: Snippet
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
export type SnippetASnippet = Snippet<SnippetASnippetElementCodenames,
{
                /*
    * Rich text with all allowed item types
    *
    * Type: rich_text
* Required: false
* Codename: snippet_a__rich_text_with_all_allowed_item_types
* Id: 72cdc4e7-dead-4baf-99bf-91d8fe62351f
    */
                readonly snippet_a__rich_text_with_all_allowed_item_types: Elements.RichTextElement<CoreType>;
                /*
    * Linked items with specific types
    *
    * Type: modular_content
* Required: false
* Codename: snippet_a__linked_items_with_specific_types
* Id: 140130dc-84c1-455f-99ab-d31579cf90d1
    */
                readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItemsElement<ContentTypeWithAllElementsType>;
                /*
    * Text
    *
    * Type: text
* Required: true
* Codename: snippet_a__text
* Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
    */
                readonly snippet_a__text: Elements.TextElement;}>;

/*
* Type representing all available element codenames for Snippet A
*/
export type SnippetASnippetElementCodenames = 'snippet_a__rich_text_with_all_allowed_item_types' | 'snippet_a__linked_items_with_specific_types' | 'snippet_a__text';



            