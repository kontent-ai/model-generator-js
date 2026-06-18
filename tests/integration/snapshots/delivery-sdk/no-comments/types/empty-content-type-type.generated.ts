import type { ContentItemOf, ContentItemPayload } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type EmptyContentTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "empty_content_type">;

export function isEmptyContentTypeTypeCodename(value: string | undefined | null): value is EmptyContentTypeTypeCodename {
	return typeof value === "string" && value === ("empty_content_type" satisfies EmptyContentTypeTypeCodename);
}

export type EmptyContentTypeTypeElements = Record<string, never>;

export type EmptyContentTypeType = ContentItemOf<CoreClientSchema, EmptyContentTypeTypeCodename, EmptyContentTypeTypeElements>;

export type EmptyContentTypeTypeElementCodenames = never;

export function isEmptyContentTypeType(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is EmptyContentTypeType {
	return isEmptyContentTypeTypeCodename(item?.system.type);
}
