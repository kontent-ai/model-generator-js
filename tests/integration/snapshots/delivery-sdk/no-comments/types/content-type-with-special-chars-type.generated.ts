import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type ContentTypeWithSpecialCharsTypeCodename = keyof Pick<Record<TypeCodenames, null>, "_content_type_with_special_chars____">;

export function isContentTypeWithSpecialCharsTypeCodename(
	value: string | undefined | null,
): value is ContentTypeWithSpecialCharsTypeCodename {
	return (
		typeof value === "string" && value === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsTypeCodename)
	);
}

export type ContentTypeWithSpecialCharsType = IContentItem<
	{
		readonly parrot__: Elements.TextElement;

		readonly _____numberelem_____________________: Elements.NumberElement;
	},
	ContentTypeWithSpecialCharsTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type ContentTypeWithSpecialCharsTypeElementCodenames = "parrot__" | "_____numberelem_____________________";

export function isContentTypeWithSpecialCharsType(item: IContentItem | undefined | null): item is ContentTypeWithSpecialCharsType {
	return item?.system.type === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsTypeCodename);
}
