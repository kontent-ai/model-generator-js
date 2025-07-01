import type { IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Type with empty snippet' type
 */
export type TypeWithEmptySnippetTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">

/*
 * Typeguard for codename of 'Type with empty snippet' type
 */
export function isTypeWithEmptySnippetTypeCodename(value: string | undefined | null): value is TypeWithEmptySnippetTypeCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetTypeCodename)
}

/*
 * Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export type TypeWithEmptySnippetType = IContentItem<Record<string, never>, TypeWithEmptySnippetTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>

/*
 * Type representing all available element codenames for Type with empty snippet
 */
export type TypeWithEmptySnippetTypeElementCodenames = never

/*
 * Type guard for Type with empty snippet
 *
 * Id: 11039462-1d7d-4673-9aa8-af07fb53985c
 * Codename: type_with_empty_snippet
 */
export function isTypeWithEmptySnippetType(item: IContentItem | undefined | null): item is TypeWithEmptySnippetType {
	return item?.system.type === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetTypeCodename)
}
