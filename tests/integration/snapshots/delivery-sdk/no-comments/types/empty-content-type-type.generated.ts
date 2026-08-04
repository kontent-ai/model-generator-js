import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type EmptyContentTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">;

export function isEmptyContentTypeCodename(value: string | undefined | null): value is EmptyContentTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeCodename);
}

export type EmptyContentTypeItem = ContentItemOf<CoreClientSchema, EmptyContentTypeCodename, Record<string, never>>;

export type EmptyContentTypeElementCodenames = never;

export function isEmptyContentTypeItem(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptyContentTypeItem {
	return isEmptyContentTypeCodename(item?.system.type);
}
