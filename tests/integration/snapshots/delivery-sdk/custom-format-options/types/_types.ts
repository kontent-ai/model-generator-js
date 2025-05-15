
            
            /*
    * Array of all codenames
    *
    * Type: Type
    */
            export const typeCodenames = ['content_type_with_snippet_only', '_content_type_with_special_chars____', 'circular_reference_type_a_b', 'page', 'content_type_with_all_elements', 'content_type_with_guidelines_only', 'circular_reference_type_b____a', 'empty_content_type', 'type_with_empty_snippet', 'web_spotlight_root', 'type_referencing_deleted_type'] as const;;
           
            /*
    * Type representing all codenames
    *
    * Type: Type
    */
            export type TypeCodenames = typeof typeCodenames[number];

            /*
    * Typeguard for codename
    *
    * Type: Type
    */
            export function isTypeCodename(value: string | undefined | null): value is TypeCodenames {
                return typeof value === 'string' && (typeCodenames as readonly string[]).includes(value);
            };
            