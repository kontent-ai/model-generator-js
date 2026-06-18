import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { SnippetCodenames } from "../system/snippets.generated.js";
import type { TypeWithEmptySnippetTypeCodename } from "../types/type-with-empty-snippet-type.generated.js";

/*
 * Type representing codename of 'Empty snippet' snippet
 */
export type EmptySnippetSnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "empty_snippet">;

/*
 * Typeguard for codename of 'Empty snippet' snippet
 */
export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
	return typeof value === "string" && value === ("empty_snippet" satisfies EmptySnippetSnippetCodename);
}

/*
 * Snippet 'Empty snippet' as a partial content item across the content types that use it
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type EmptySnippetSnippet = SnippetOf<CoreClientSchema, TypeWithEmptySnippetTypeCodename, Record<string, never>>;

/*
 * Type representing all available element codenames for Empty snippet
 */
export type EmptySnippetSnippetElementCodenames = never;

/*
 * Type guard for Empty snippet
 */
export function isEmptySnippetSnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptySnippetSnippet {
	return !!item && (["type_with_empty_snippet"] as readonly string[]).includes(item.system.type);
}
