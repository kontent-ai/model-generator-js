import type { IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type TypeWithEmptySnippetTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_with_empty_snippet">;

export function isTypeWithEmptySnippetTypeCodename(value: string | undefined | null): value is TypeWithEmptySnippetTypeCodename {
	return typeof value === "string" && value === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetTypeCodename);
}

export type TypeWithEmptySnippetType = IContentItem<
	Record<string, never>,
	TypeWithEmptySnippetTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type TypeWithEmptySnippetTypeElementCodenames = never;

export function isTypeWithEmptySnippetType(item: IContentItem | undefined | null): item is TypeWithEmptySnippetType {
	return item?.system.type === ("type_with_empty_snippet" satisfies TypeWithEmptySnippetTypeCodename);
}
