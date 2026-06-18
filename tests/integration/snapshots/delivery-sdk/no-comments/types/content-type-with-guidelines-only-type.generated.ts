import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type ContentTypeWithGuidelinesOnlyTypeCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

export function isContentTypeWithGuidelinesOnlyTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithGuidelinesOnlyTypeCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyTypeCodename);
}

export type ContentTypeWithGuidelinesOnlyTypeElements = Record<string, never>;

export type ContentTypeWithGuidelinesOnlyType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithGuidelinesOnlyTypeCodename,
	ContentTypeWithGuidelinesOnlyTypeElements
>;

export type ContentTypeWithGuidelinesOnlyTypeElementCodenames = never;

export function isContentTypeWithGuidelinesOnlyType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithGuidelinesOnlyType {
	return isContentTypeWithGuidelinesOnlyTypeCodename(item?.system.type);
}
