import type { TypeCodenames } from "../system/types.generated.js";
import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";

export type TypeWithEmptySnippetTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">;

export function isTypeWithEmptySnippetTypeCodename(value: string | undefined | null): value is TypeWithEmptySnippetTypeCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetTypeCodename);
}

export type TypeWithEmptySnippetType = ContentItemOf<CoreClientSchema, TypeWithEmptySnippetTypeCodename, Record<string, never>>;

export type TypeWithEmptySnippetTypeElementCodenames = never;

export function isTypeWithEmptySnippetType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeWithEmptySnippetType {
	return isTypeWithEmptySnippetTypeCodename(item?.system.type);
}
