
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreItem } from '../system/index.js';
import type { SnippetA } from '../itemSnippets/index.js';
import type { TaxonomyATaxonomyCodename } from '../taxonomies/index.js';

/**
* Content type with all elements
* 
* Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
* Codename: content_type_with_all_elements    
*/
export type ContentTypeWithAllElements = CoreItem<
ContentTypeWithAllElementsElementCodenames,
{
                /**
                * Text element
                * 
                * Type: text
                * Required: true
                * Codename: text_element
                * Id: cf24e550-3bbe-4e9d-aee6-e81b9b490228
* Guidelines: Simple text element guidelines
                */ 
                readonly text_element: Elements.TextElement;
                /**
                * Url slug element
                * 
                * Type: url_slug
                * Required: false
                * Codename: url_slug_element
                * Id: e117d1ae-d985-4df2-b6c7-b3aa03521a00
                */ 
                readonly url_slug_element: Elements.UrlSlugElement;
                /**
                * Rich text element
                * 
                * Type: rich_text
                * Required: false
                * Codename: rich_text_element
                * Id: 81ee0883-8c1b-49cc-8d11-2fd1dcf75c5c
                */ 
                readonly rich_text_element: Elements.RichTextElement<CoreItem>;
                /**
                * Date & time element
                * 
                * Type: date_time
                * Required: false
                * Codename: date___time_element
                * Id: 38d5d709-4152-445c-b1ef-333147bd656e
                */ 
                readonly date___time_element: Elements.DateTimeElement;
                /**
                * Custom element
                * 
                * Type: custom
                * Required: false
                * Codename: custom_element
                * Id: 768581f2-7b56-4be3-a8a2-a1850dbe493e
                */ 
                readonly custom_element: Elements.CustomElement;
                /**
                * Linked items element
                * 
                * Type: modular_content
                * Required: false
                * Codename: linked_items_element
                * Id: 4631c94d-034c-428a-88bb-cae6d7985ff5
                */ 
                readonly linked_items_element: Elements.LinkedItemsElement<ContentTypeWithAllElements>;
                /**
                * Asset element
                * 
                * Type: asset
                * Required: false
                * Codename: asset_element
                * Id: fc99d625-106b-4f95-b37e-7f7be358d3d1
                */ 
                readonly asset_element: Elements.AssetsElement;
                /**
                * Multiple choice element
                * 
                * Type: multiple_choice
                * Required: false
                * Codename: multiple_choice_element
                * Id: 709148dd-8c3f-4660-95b8-a72f386dd367
                */ 
                readonly multiple_choice_element: Elements.MultipleChoiceElement<'option_a' | 'option_b'>;
                /**
                * Number element
                * 
                * Type: number
                * Required: false
                * Codename: number_element
                * Id: 7416ea32-3d33-45bb-bf2a-2226f658e953
                */ 
                readonly number_element: Elements.NumberElement;
                /**
                * Taxonomy A
                * 
                * Type: taxonomy
                * Required: false
                * Codename: taxonomy_element
                * Id: 6073dec8-2489-479f-9916-abc055126e59
                */ 
                readonly taxonomy_element: Elements.TaxonomyElement<TaxonomyATaxonomyCodename, 'taxonomy_element'>;} & SnippetA, 
'content_type_with_all_elements'>

/**
* Type representing all available element codenames for Content type with all elements
*/
export type ContentTypeWithAllElementsElementCodenames = 'text_element' | 'url_slug_element' | 'rich_text_element' | 'date___time_element' | 'custom_element' | 'linked_items_element' | 'asset_element' | 'multiple_choice_element' | 'number_element' | 'snippet_a__rich_text_with_all_allowed_item_types' | 'snippet_a__linked_items_with_specific_types' | 'snippet_a__text' | 'taxonomy_element';;

/**
* Type guard for Content type with all elements
*
* Id: 071c7591-e7f0-41ac-984f-7a3db35f97e8
* Codename: content_type_with_all_elements
*/
export function isContentTypeWithAllElementsItem(item: CoreItem | undefined | null): item is ContentTypeWithAllElements {
                return item?.system?.type === 'content_type_with_all_elements';
            };
