import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreItem } from '../system/index.ts';

/*
 * 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export type ContentTypeWithSpecialChars = CoreItem<
	ContentTypeWithSpecialCharsElementCodenames,
	{
		/*
		 * 🦜Parrot_emoji
		 *
		 * Type: text
		 * Required: false
		 * Codename: parrot__
		 * Id: cafaa776-893d-4e8c-b460-9534ac2fe769
		 */
		readonly parrot__: Elements.TextElement;
		/*
		 * !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~
		 *
		 * Type: number
		 * Required: false
		 * Codename: _____numberelem_____________________
		 * Id: 3bb33958-71f3-4039-8594-5f0df9378dbb
		 */
		readonly _____numberelem_____________________: Elements.NumberElement;
	},
	'_content_type_with_special_chars____'
>;

/*
 * Type representing all available element codenames for 🐧 Content type with special chars #!_'
 */
export type ContentTypeWithSpecialCharsElementCodenames = 'parrot__' | '_____numberelem_____________________';

/*
 * Type guard for 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export function isContentTypeWithSpecialChars(item: CoreItem | undefined | null): item is ContentTypeWithSpecialChars {
	return item?.system?.type === '_content_type_with_special_chars____';
}
