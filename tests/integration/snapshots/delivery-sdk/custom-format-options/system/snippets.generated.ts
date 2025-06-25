
            
            /*
* Array of all snippet codenames
*/
            export const snippetCodenames = ['snippet_a', 'empty_snippet'] as const;;
           
            /*
* Type representing all snippet codenames
*/
            export type SnippetCodenames = typeof snippetCodenames[number];;

            /*
* Typeguard for snippet codename
*/
            export function isSnippetCodename(value: string | undefined | null): value is SnippetCodenames {
                return typeof value === 'string' && (snippetCodenames as readonly string[]).includes(value);
            };
            