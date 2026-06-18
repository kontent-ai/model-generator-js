import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type ContentTypeWithSpecialCharsTypeCodename = keyof Pick<Record<TypeCodenames, null>, "_content_type_with_special_chars____">;

export function isContentTypeWithSpecialCharsTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithSpecialCharsTypeCodename {
	return (
		typeof value === "string" && value === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsTypeCodename)
	);
}

export type ContentTypeWithSpecialCharsType = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithSpecialCharsTypeCodename,
	{
		readonly parrot__: Elements.Text;

		readonly _____numberelem_____________________: Elements.Number;
	}
>;

export type ContentTypeWithSpecialCharsTypeElementCodenames = "parrot__" | "_____numberelem_____________________";

export function isContentTypeWithSpecialCharsType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithSpecialCharsType {
	return isContentTypeWithSpecialCharsTypeCodename(item?.system.type);
}
