import type { SnippetCodenames } from './_snippets.js';
import type { Snippet } from '@kontent-ai/delivery-sdk';

/*
 * Type representing codename of entity
 *
 * Name: Empty snippet
 * Codename: empty_snippet
 * Type: Snippet
 */
export type EmptySnippetSnippetCodename = Extract<SnippetCodenames, 'empty_snippet'>;

/*
 * Typeguard function for entity
 *
 * Name: Empty snippet
 * Codename: empty_snippet
 * Type: Snippet
 */
export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
	return typeof value === 'string' && value === ('empty_snippet' satisfies EmptySnippetSnippetCodename);
}

/*
 * Empty snippet
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type EmptySnippetSnippet = Snippet<EmptySnippetSnippetElementCodenames, Record<string, never>>;

/*
 * Type representing all available element codenames for Empty snippet
 */
export type EmptySnippetSnippetElementCodenames = never;
