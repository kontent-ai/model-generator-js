import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { ContentTypeTypeWithEmptySnippetCodename } from "../types/content-type-type-with-empty-snippet.generated.js";

/*
 * Snippet 'Empty snippet' as a partial content item across the content types that use it
 *
 * Id: 1d7e3745-3320-4107-996b-2c6b240df7ae
 * Codename: empty_snippet
 */
export type SnippetEmptySnippet = SnippetOf<CoreClientSchema, ContentTypeTypeWithEmptySnippetCodename, Record<string, never>>;

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
