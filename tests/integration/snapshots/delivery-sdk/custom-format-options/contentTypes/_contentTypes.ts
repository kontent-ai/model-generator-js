
            
            /*
                * Object with all values of ContentType codenames 
            */
            export const contentTypeCodenames = ['content_type_with_snippet_only', '_content_type_with_special_chars____', 'circular_reference_type_a_b', 'page', 'content_type_with_all_elements', 'content_type_with_guidelines_only', 'circular_reference_type_b____a', 'empty_content_type', 'type_with_empty_snippet', 'web_spotlight_root'] as const;;

            /*
                * Type representing ContentType codenames 
            */
            export type ContentTypeCodenames = typeof contentTypeCodenames[number];

            /*
                * Type guard for ContentType codenames 
            */
            export function isContentTypeCodename(value: string | undefined | null): value is ContentTypeCodenames {
                return typeof value === 'string' && (contentTypeCodenames as readonly string[]).includes(value);
            };
            