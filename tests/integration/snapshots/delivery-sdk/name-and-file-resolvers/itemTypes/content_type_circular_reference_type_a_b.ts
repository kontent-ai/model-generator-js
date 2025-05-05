import type { Elements } from '@kontent-ai/delivery-sdk';
import type { ContentType_circular_reference_type_b____a } from './index.js';
import type { CoreItem } from '../system/index.js';

/*
 * Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export type ContentType_circular_reference_type_a_b = CoreItem<
	ContentType_circular_reference_type_a_bElementCodenames,
	{
		/*
		 * Items
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: items
		 * Id: 33ab92dd-e47d-45e2-a060-3b5df0754c24
		 */
		readonly items: Elements.LinkedItemsElement<ContentType_circular_reference_type_b____a>;
	},
	'circular_reference_type_a_b'
>;

/*
 * Type representing all available element codenames for Circular reference type A > B
 */
export type ContentType_circular_reference_type_a_bElementCodenames = 'items';

/*
 * Type guard for Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export function isContentType_circular_reference_type_a_b(
	item: CoreItem | undefined | null
): item is ContentType_circular_reference_type_a_b {
	return item?.system?.type === 'circular_reference_type_a_b';
}
