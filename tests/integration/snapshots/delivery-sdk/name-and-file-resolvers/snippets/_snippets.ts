/*
 * Object with all values of Snippet codenames
 */
export const snippetCodenames = ['snippet_a', 'empty_snippet'] as const;

/*
 * Type representing Snippet codenames
 */
export type SnippetCodenames = (typeof snippetCodenames)[number];

/*
 * Type guard for Snippet codenames
 */
export function isSnippetCodename(value: string | undefined | null): value is SnippetCodenames {
	return typeof value === 'string' && (snippetCodenames as readonly string[]).includes(value);
}
