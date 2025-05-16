import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.js';

/*
 * Web spotlight root
 *
 * Codename: web_spotlight_root
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 */
export type WebSpotlightRootItem = CoreMigrationItem<
	'web_spotlight_root',
	{
		/*
		 * Title
		 *
		 * Codename: title
		 * Id: e9d19fa4-4ad3-4b3f-998a-ca392651f7d0
		 * Type: text
		 * Required: false
		 */
		readonly title: MigrationElementModels.TextElement;

		/*
		 * Subpages
		 *
		 * Codename: subpages
		 * Id: e6702a6b-35b8-4a12-acca-1b1361fc926b
		 * Type: subpages
		 * Required: false
		 * Allowed content types: page
		 */
		readonly subpages: MigrationElementModels.SubpagesElement;

		/*
		 * Content
		 *
		 * Codename: content
		 * Id: ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8
		 * Type: modular_content
		 * Required: false
		 */
		readonly content: MigrationElementModels.LinkedItemsElement;
	}
>;
