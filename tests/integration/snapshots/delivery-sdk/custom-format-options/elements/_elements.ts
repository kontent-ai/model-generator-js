
            
            /*
                * Object with all values of Element codenames 
            */
            export const elementCodenames = ['snippet_a__rich_text_with_all_allowed_item_types', 'snippet_a__linked_items_with_specific_types', 'snippet_a__text', 'parrot__', '_____numberelem_____________________', 'items', 'title', 'url', 'show_in_navigation', 'subpages', 'content', 'text_element', 'url_slug_element', 'rich_text_element', 'date___time_element', 'custom_element', 'linked_items_element', 'asset_element', 'multiple_choice_element', 'number_element', 'snippet_a__rich_text_with_all_allowed_item_types', 'snippet_a__linked_items_with_specific_types', 'snippet_a__text', 'taxonomy_element', 'items', 'title', 'subpages', 'content', 'snippet_a__rich_text_with_all_allowed_item_types', 'snippet_a__linked_items_with_specific_types', 'snippet_a__text'] as const;;

            /*
                * Type representing Element codenames 
            */
            export type ElementCodenames = typeof elementCodenames[number];

            /*
                * Type guard for Element codenames 
            */
            export function isElementCodename(value: string | undefined | null): value is ElementCodenames {
                return typeof value === 'string' && (elementCodenames as readonly string[]).includes(value);
            };
            