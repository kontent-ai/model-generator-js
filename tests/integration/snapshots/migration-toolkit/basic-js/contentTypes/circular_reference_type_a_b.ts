import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.js';

/*
 * Circular reference type A > B
 *
 * Codename: circular_reference_type_a_b
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 */
export type CircularReferenceTypeABItem = CoreMigrationItem<
	'circular_reference_type_a_b',
	{
		/*
		 * Items
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: items
		 * Id: 33ab92dd-e47d-45e2-a060-3b5df0754c24
		 */
		readonly items: MigrationElementModels.LinkedItemsElement;
	}
>;
