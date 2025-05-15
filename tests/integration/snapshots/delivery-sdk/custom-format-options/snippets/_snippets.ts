
            
            /*
    * Array of all codenames
    *
    * Type: Snippet
    */
            export const snippetCodenames = ['snippet_a', 'empty_snippet'] as const;;
           
            /*
    * Type representing all codenames
    *
    * Type: Snippet
    */
            export type SnippetCodenames = typeof snippetCodenames[number];

            /*
    * Typeguard for codename
    *
    * Type: Snippet
    */
            export function isSnippetCodename(value: string | undefined | null): value is SnippetCodenames {
                return typeof value === 'string' && (snippetCodenames as readonly string[]).includes(value);
            };
            