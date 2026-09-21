import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Type with empty snippet' type
 */
export type TypeWithEmptySnippetCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">;

/*
 * Typeguard for codename of 'Type with empty snippet' type
 */
export function isTypeWithEmptySnippetCodename(value: string | undefined | null): value is TypeWithEmptySnippetCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetCodename);
}

/*
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type TypeWithEmptySnippetItem = ContentItemOf<CoreClientSchema, TypeWithEmptySnippetCodename, Record<string, never>>;

/*
 * Type representing all available element codenames for Type with empty snippet
 */
export type TypeWithEmptySnippetElementCodenames = never;

/*
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isTypeWithEmptySnippetItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeWithEmptySnippetItem {
	return isTypeWithEmptySnippetCodename(item?.system.type);
}
