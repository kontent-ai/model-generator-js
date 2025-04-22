import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.js';

/*
 * 🐧 Content type with special chars #!_'
 *
 * Codename: _content_type_with_special_chars____
 * Id: 66bfcb40-edd7-4edf-8176-33517d0d6f80
 */
export type ContentTypeWithSpecialCharsItem = CoreMigrationItem<
	'_content_type_with_special_chars____',
	{
		/*
		 * 🦜Parrot_emoji
		 *
		 * Type: text
		 * Required: false
		 * Codename: parrot__
		 * Id: cafaa776-893d-4e8c-b460-9534ac2fe769
		 */
		readonly parrot__: MigrationElementModels.TextElement;

		/*
		 * !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~
		 *
		 * Type: number
		 * Required: false
		 * Codename: _____numberelem_____________________
		 * Id: 3bb33958-71f3-4039-8594-5f0df9378dbb
		 */
		readonly _____numberelem_____________________: MigrationElementModels.NumberElement;
	}
>;
