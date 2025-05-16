import type { SnippetCodenames } from './_snippets.js';
import type { Snippet } from '@kontent-ai/delivery-sdk';

/*
 * Type representing codename of 'Empty snippet' snippet
 */
export type SnippetEmptySnippetCodename = Extract<SnippetCodenames, 'empty_snippet'>;

/*
 * Typeguard for codename of 'Empty snippet' snippet
 */
export function isSnippetEmptySnippetCodename(value: string | undefined | null): value is SnippetEmptySnippetCodename {
	return typeof value === 'string' && value === ('empty_snippet' satisfies SnippetEmptySnippetCodename);
}

/*
 * Empty snippet
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type SnippetEmptySnippet = Snippet<SnippetEmptySnippetElementCodenames, Record<string, never>>;

/*
 * Type representing all available element codenames for Empty snippet
 */
export type SnippetEmptySnippetElementCodenames = never;
