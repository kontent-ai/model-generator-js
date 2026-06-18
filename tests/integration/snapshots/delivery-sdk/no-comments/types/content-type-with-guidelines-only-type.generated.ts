import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type ContentTypeWithGuidelinesOnlyCodename = keyof Pick<Record<TypeCodenames, null>, "content_type_with_guidelines_only">;

export function isContentTypeWithGuidelinesOnlyCodename(value: string | undefined | null): value is ContentTypeWithGuidelinesOnlyCodename {
	return typeof value === "string" && value === ("content_type_with_guidelines_only" satisfies ContentTypeWithGuidelinesOnlyCodename);
}

export type ContentTypeWithGuidelinesOnlyItem = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithGuidelinesOnlyCodename,
	Record<string, never>
>;

export type ContentTypeWithGuidelinesOnlyElementCodenames = never;

export function isContentTypeWithGuidelinesOnlyItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithGuidelinesOnlyItem {
	return isContentTypeWithGuidelinesOnlyCodename(item?.system.type);
}
