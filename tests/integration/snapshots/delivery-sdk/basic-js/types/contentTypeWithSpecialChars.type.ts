import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: 🐧 Content type with special chars #!_'
 * Codename: _content_type_with_special_chars____
 * Type: Type
 */
export type ContentTypeWithSpecialCharsTypeCodename = Extract<TypeCodenames, '_content_type_with_special_chars____'>;

/*
 * Type guard for 🐧 Content type with special chars #!_'
 *
 * Name: 🐧 Content type with special chars #!_'
 * Codename: _content_type_with_special_chars____
 * Type: Type
 */
export function isContentTypeWithSpecialCharsTypeCodename(
	value: string | undefined | null
): value is ContentTypeWithSpecialCharsTypeCodename {
	return (
		typeof value === 'string' && value === ('_content_type_with_special_chars____' satisfies ContentTypeWithSpecialCharsTypeCodename)
	);
}

/*
 * 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export type ContentTypeWithSpecialCharsType = CoreType<
	ContentTypeWithSpecialCharsTypeElementCodenames,
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
	ContentTypeWithSpecialCharsTypeCodename
>;

/*
 * Type representing all available element codenames for 🐧 Content type with special chars #!_'
 */
export type ContentTypeWithSpecialCharsTypeElementCodenames = 'parrot__' | '_____numberelem_____________________';

/*
 * Type guard for 🐧 Content type with special chars #!_'
 *
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 * Codename: _content_type_with_special_chars____
 */
export function isContentTypeWithSpecialCharsType(item: CoreType | undefined | null): item is ContentTypeWithSpecialCharsType {
	return item?.system?.type === ('_content_type_with_special_chars____' satisfies ContentTypeWithSpecialCharsTypeCodename);
}
