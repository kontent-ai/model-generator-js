import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of '🐧 Content type with special chars #!_'' type
 */
export type ContentTypeWithSpecialCharsTypeCodename = keyof Pick<Record<TypeCodenames, null>, "_content_type_with_special_chars____">

/*
 * Typeguard for codename of '🐧 Content type with special chars #!_'' type
 */
export function isContentTypeWithSpecialCharsTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithSpecialCharsTypeCodename {
	return typeof value === "string" && value === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsTypeCodename)
}

/*
 * 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export type ContentTypeWithSpecialCharsType = IContentItem<
	{
		/*
		 * 🦜Parrot_emoji
		 *
		 * Codename: parrot__
		 * Id: cafaa776-893d-4e8c-b460-9534ac2fe769
		 * Type: text
		 * Required: false
		 */
		readonly parrot__: Elements.TextElement

		/*
		 * !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~
		 *
		 * Codename: _____numberelem_____________________
		 * Id: 3bb33958-71f3-4039-8594-5f0df9378dbb
		 * Type: number
		 * Required: false
		 */
		readonly _____numberelem_____________________: Elements.NumberElement
	},
	ContentTypeWithSpecialCharsTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for 🐧 Content type with special chars #!_'
 */
export type ContentTypeWithSpecialCharsTypeElementCodenames = "parrot__" | "_____numberelem_____________________"

/*
 * Type guard for 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export function isContentTypeWithSpecialCharsType(item: IContentItem | undefined | null): item is ContentTypeWithSpecialCharsType {
	return item?.system.type === ("_content_type_with_special_chars____" satisfies ContentTypeWithSpecialCharsTypeCodename)
}
