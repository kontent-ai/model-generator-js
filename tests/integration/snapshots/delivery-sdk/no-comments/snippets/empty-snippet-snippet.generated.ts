import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeWithEmptySnippetCodename } from "../types/type-with-empty-snippet-type.generated.js";

export type EmptySnippetSnippet = SnippetOf<CoreClientSchema, TypeWithEmptySnippetCodename, Record<string, never>>;

export type EmptySnippetSnippetElementCodenames = never;

export function isEmptySnippetSnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptySnippetSnippet {
	return !!item && (["type_with_empty_snippet"] as readonly string[]).includes(item.system.type);
}
