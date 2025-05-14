import type { SnippetCodenames } from './_snippets.ts';

/*
 * Type representing codename of Snippet A
 *
 * Codename: snippet_a
 */
export type SnippetASnippetCodename = Extract<SnippetCodenames, 'snippet_a'>;

/*
 * Type guard for Snippet A
 *
 * Codename: snippet_a
 */
export function isSnippetASnippetCodename(value: string | undefined | null): value is SnippetASnippetCodename {
	return typeof value === 'string' && value === ('snippet_a' satisfies SnippetASnippetCodename);
}
