import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type TypeWithEmptySnippetCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">;

export function isTypeWithEmptySnippetCodename(value: string | undefined | null): value is TypeWithEmptySnippetCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetCodename);
}

export type TypeWithEmptySnippetItem = ContentItemOf<CoreClientSchema, TypeWithEmptySnippetCodename, Record<string, never>>;

export type TypeWithEmptySnippetElementCodenames = never;

export function isTypeWithEmptySnippetItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeWithEmptySnippetItem {
	return isTypeWithEmptySnippetCodename(item?.system.type);
}
