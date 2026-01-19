import type { Snippet } from "@kontent-ai/delivery-sdk";
import type { SnippetCodenames } from "../system/snippets.generated.js";

export type EmptySnippetSnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "empty_snippet">;

export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
	return typeof value === "string" && value === ("empty_snippet" satisfies EmptySnippetSnippetCodename);
}

export type EmptySnippetSnippet = Snippet<EmptySnippetSnippetElementCodenames, Record<string, never>>;

export type EmptySnippetSnippetElementCodenames = never;
