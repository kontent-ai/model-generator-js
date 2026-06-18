import type { SnippetCodenames } from "../system/snippets.generated.js";
import type { ContentItemPayload, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeWithEmptySnippetTypeCodename } from "../types/type-with-empty-snippet-type.generated.js";

export type EmptySnippetSnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "empty_snippet">;

export function isEmptySnippetSnippetCodename(value: string | undefined | null): value is EmptySnippetSnippetCodename {
	return typeof value === "string" && value === ("empty_snippet" satisfies EmptySnippetSnippetCodename);
}

export type EmptySnippetSnippet = SnippetOf<CoreClientSchema, TypeWithEmptySnippetTypeCodename, Record<string, never>>;

export type EmptySnippetSnippetElementCodenames = never;

export function isEmptySnippetSnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptySnippetSnippet {
	return !!item && (["type_with_empty_snippet"] as readonly string[]).includes(item.system.type);
}
