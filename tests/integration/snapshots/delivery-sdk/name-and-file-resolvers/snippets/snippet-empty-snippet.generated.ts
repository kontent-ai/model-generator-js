import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { SnippetCodenames } from "../system/snippets.generated.js";
import type { ContentTypeTypeWithEmptySnippetCodename } from "../types/content-type-type-with-empty-snippet.generated.js";

/*
 * Type representing codename of 'Empty snippet' snippet
 */
export type SnippetEmptySnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "empty_snippet">;

/*
 * Typeguard for codename of 'Empty snippet' snippet
 */
export function isSnippetEmptySnippetCodename(value: string | undefined | null): value is SnippetEmptySnippetCodename {
	return typeof value === "string" && value === ("empty_snippet" satisfies SnippetEmptySnippetCodename);
}

/*
 * Elements of the 'Empty snippet' snippet. Intersect this into the elements of content types that use the snippet.
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type SnippetEmptySnippetElements = Record<string, never>;

/*
 * Snippet 'Empty snippet' as a partial content item across the content types that use it
 */
export type SnippetEmptySnippet = SnippetOf<CoreClientSchema, ContentTypeTypeWithEmptySnippetCodename, SnippetEmptySnippetElements>;

/*
 * Type representing all available element codenames for Empty snippet
 */
export type SnippetEmptySnippetElementCodenames = never;

/*
 * Type guard for Empty snippet
 */
export function isSnippetEmptySnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is SnippetEmptySnippet {
	return !!item && (["type_with_empty_snippet"] as readonly string[]).includes(item.system.type);
}
