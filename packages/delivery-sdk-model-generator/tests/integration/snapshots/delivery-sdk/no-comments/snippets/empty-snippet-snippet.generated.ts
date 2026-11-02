import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { TypedClientSchema } from "../system/main.system.generated.js";
import type { TypeWithEmptySnippetCodename } from "../types/type-with-empty-snippet-type.generated.js";

export type EmptySnippetSnippet = SnippetOf<TypedClientSchema, TypeWithEmptySnippetCodename, Record<string, never>>;

export type EmptySnippetSnippetElementCodenames = never;

export function isEmptySnippetSnippet(item: ContentItemPayload<TypedClientSchema> | undefined | null): item is EmptySnippetSnippet {
	return !!item && (["type_with_empty_snippet"] as readonly string[]).includes(item.system.type);
}
