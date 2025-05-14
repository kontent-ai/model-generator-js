
            import type { SnippetCodenames } from './_snippets.js';
           
    
            /*
                * Type representing codename of Empty snippet
                * 
                * Codename: empty_snippet
                */
            export type EmptySnippetSnippetCodename = Extract<SnippetCodenames, 'empty_snippet'>;

            /*
                * Type guard for Empty snippet
                * 
                * Codename: empty_snippet
            */
            export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
                return typeof value === 'string' && value === ('empty_snippet' satisfies EmptySnippetSnippetCodename);
            }
            
            