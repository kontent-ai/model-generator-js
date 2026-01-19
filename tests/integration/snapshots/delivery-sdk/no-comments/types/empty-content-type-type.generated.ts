import type { IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type EmptyContentTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">;

export function isEmptyContentTypeTypeCodename(value: string | undefined | null): value is EmptyContentTypeTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeTypeCodename);
}

export type EmptyContentTypeType = IContentItem<
	Record<string, never>,
	EmptyContentTypeTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type EmptyContentTypeTypeElementCodenames = never;

export function isEmptyContentTypeType(item: IContentItem | undefined | null): item is EmptyContentTypeType {
	return item?.system.type === ("empty_content_type" satisfies EmptyContentTypeTypeCodename);
}
