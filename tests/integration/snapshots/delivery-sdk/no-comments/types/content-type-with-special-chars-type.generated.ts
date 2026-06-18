import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";

export type ContentTypeWithSpecialCharsCodename = keyof Pick<Record<TypeCodenames, null>, "_content_type_with_special_chars____">;

export function isContentTypeWithSpecialCharsCodename(value: string | undefined | null): value is ContentTypeWithSpecialCharsCodename {
	return typeof value === "string" && value === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsCodename);
}

export type ContentTypeWithSpecialCharsItem = ContentItemOf<
	CoreClientSchema,
	ContentTypeWithSpecialCharsCodename,
	{
		readonly parrot__: Elements.Text;

		readonly _____numberelem_____________________: Elements.Number;
	}
>;

export type ContentTypeWithSpecialCharsElementCodenames = "parrot__" | "_____numberelem_____________________";

export function isContentTypeWithSpecialCharsItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is ContentTypeWithSpecialCharsItem {
	return isContentTypeWithSpecialCharsCodename(item?.system.type);
}
