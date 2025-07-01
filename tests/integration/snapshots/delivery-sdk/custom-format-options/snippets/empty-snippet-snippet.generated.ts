import type { Snippet } from "@kontent-ai/delivery-sdk"
import type { SnippetCodenames } from "../system/snippets.generated.js"

/*
 * Type representing codename of 'Empty snippet' snippet
 */
export type EmptySnippetSnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "empty_snippet">

/*
 * Typeguard for codename of 'Empty snippet' snippet
 */
export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
	return typeof value === "string" && value === ("empty_snippet" satisfies EmptySnippetSnippetCodename)
}

/*
 * Empty snippet
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type EmptySnippetSnippet = Snippet<EmptySnippetSnippetElementCodenames, Record<string, never>>

/*
 * Type representing all available element codenames for Empty snippet
 */
export type EmptySnippetSnippetElementCodenames = never
