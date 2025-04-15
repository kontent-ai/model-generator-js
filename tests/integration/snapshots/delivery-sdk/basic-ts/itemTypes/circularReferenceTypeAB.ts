import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CircularReferenceTypeBA } from './index.ts';
import type { CoreItem } from '../system/index.ts';

/**
 * Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export type CircularReferenceTypeAB = CoreItem<
    CircularReferenceTypeABElementCodenames,
    {
        /**
         * Items
         *
         * Type: modular_content
         * Required: false
         * Codename: items
         * Id: 33ab92dd-e47d-45e2-a060-3b5df0754c24
         */
        readonly items: Elements.LinkedItemsElement<CircularReferenceTypeBA>;
    },
    'circular_reference_type_a_b'
>;

/**
 * Type representing all available element codenames for Circular reference type A > B
 */
export type CircularReferenceTypeABElementCodenames = 'items';

/**
 * Type guard for Circular reference type A > B
 *
 * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
 * Codename: circular_reference_type_a_b
 */
export function isCircularReferenceTypeABItem(item: CoreItem | undefined | null): item is CircularReferenceTypeAB {
    return item?.system?.type === 'circular_reference_type_a_b';
}
