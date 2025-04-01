import type { Elements, Snippet } from '@kontent-ai/delivery-sdk';
import type { ContentType_content_type_with_all_elements } from '../content-types/index.js';

/**
 * Snippet A
 *
 * Id: b74eb5f6-c851-42f2-9fea-e367d0a3fa61
 * Codename: snippet_a
 */
export type Snippet_snippet_a = Snippet<
    Snippet_snippet_aElementCodenames,
    {
        /**
         * Linked items with specific types
         *
         * Type: modular_content
         * Required: false
         * Codename: snippet_a__linked_items_with_specific_types
         * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
         */
        readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItemsElement<ContentType_content_type_with_all_elements>;
        /**
         * Text
         *
         * Type: text
         * Required: true
         * Codename: snippet_a__text
         * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
         */
        readonly snippet_a__text: Elements.TextElement;
    }
>;

/**
 * Type representing all available element codenames for Snippet A
 */
export type Snippet_snippet_aElementCodenames = 'snippet_a__linked_items_with_specific_types' | 'snippet_a__text';
