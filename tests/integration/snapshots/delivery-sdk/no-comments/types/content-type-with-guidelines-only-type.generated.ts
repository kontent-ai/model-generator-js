import type { IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type ContentTypeWithGuidelinesOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

export function isContentTypeWithGuidelinesOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithGuidelinesOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename);
}

export type ContentTypeWithGuidelinesOnlyType = IContentItem<
	Record<string, never>,
	ContentTypeWithGuidelinesOnlyTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type ContentTypeWithGuidelinesOnlyTypeElementCodenames = never;

export function isContentTypeWithGuidelinesOnlyType(item: IContentItem | undefined | null): item is ContentTypeWithGuidelinesOnlyType {
	return item?.system.type === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename);
}
