import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.js';

/*
 * Page
 *
 * Codename: page
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 */
export type PageItem = CoreMigrationItem<
	'page',
	{
		/*
		 * Title
		 *
		 * Type: text
		 * Required: false
		 * Codename: title
		 * Id: e9ad8c8f-6fb0-41d2-8caa-4e4e0ba24719
		 */
		readonly title: MigrationElementModels.TextElement;

		/*
		 * URL
		 *
		 * Type: url_slug
		 * Required: false
		 * Codename: url
		 * Id: e573bfc9-3193-4224-9d2a-9efb83da8849
		 */
		readonly url: MigrationElementModels.UrlSlugElement;

		/*
		 * Show in navigation
		 *
		 * Type: multiple_choice
		 * Required: false
		 * Codename: show_in_navigation
		 * Id: 07889917-fdc5-4285-bc30-4fed2a218c89
		 */
		readonly show_in_navigation: MigrationElementModels.MultipleChoiceElement;

		/*
		 * Subpages
		 *
		 * Type: subpages
		 * Required: false
		 * Codename: subpages
		 * Id: b909dc5d-0efe-478a-9257-83e5c90e884d
		 */
		readonly subpages: MigrationElementModels.SubpagesElement;

		/*
		 * Content
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: content
		 * Id: dfb0d07c-531e-4eaa-8f7d-e62671d4ca36
		 */
		readonly content: MigrationElementModels.LinkedItemsElement;
	}
>;
