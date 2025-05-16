import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of '🐧 Content type with special chars #!_'' type
 */
export type ContentTypeContentTypeWithSpecialCharsTypeCodename = Extract<TypeCodenames, '_content_type_with_special_chars____'>;

/*
 * Typeguard for codename of '🐧 Content type with special chars #!_'' type
 */
export function isContentTypeContentTypeWithSpecialCharsTypeCodename(
	value: string | undefined | null
): value is ContentTypeContentTypeWithSpecialCharsTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('_content_type_with_special_chars____' satisfies ContentTypeContentTypeWithSpecialCharsTypeCodename)
	);
}

/*
 * 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export type ContentTypeContentTypeWithSpecialCharsType = CoreType<
	ContentTypeContentTypeWithSpecialCharsTypeElementCodenames,
	{
		/*
		 * 🦜Parrot_emoji
		 *
		 * Codename: parrot__
		 * Id: cafaa776-893d-4e8c-b460-9534ac2fe769
		 * Type: text
		 * Required: false
		 */
		readonly parrot__: Elements.TextElement;

		/*
		 * !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~
		 *
		 * Codename: _____numberelem_____________________
		 * Id: 3bb33958-71f3-4039-8594-5f0df9378dbb
		 * Type: number
		 * Required: false
		 */
		readonly _____numberelem_____________________: Elements.NumberElement;
	},
	ContentTypeContentTypeWithSpecialCharsTypeCodename
>;

/*
 * Type representing all available element codenames for 🐧 Content type with special chars #!_'
 */
export type ContentTypeContentTypeWithSpecialCharsTypeElementCodenames = 'parrot__' | '_____numberelem_____________________';

/*
 * Type guard for 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export function isContentTypeContentTypeWithSpecialChars(
	item: CoreType | undefined | null
): item is ContentTypeContentTypeWithSpecialCharsType {
	return item?.system?.type === ('_content_type_with_special_chars____' satisfies ContentTypeContentTypeWithSpecialCharsTypeCodename);
}
