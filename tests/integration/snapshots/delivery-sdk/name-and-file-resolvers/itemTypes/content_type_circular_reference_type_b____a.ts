import type { Elements } from '@kontent-ai/delivery-sdk';
import type { ContentType_circular_reference_type_a_b } from './index.js';
import type { CoreItem } from '../system/index.js';

/**
 * Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export type ContentType_circular_reference_type_b____a = CoreItem<
    ContentType_circular_reference_type_b____aElementCodenames,
    {
        /**
         * Items
         *
         * Type: modular_content
         * Required: false
         * Codename: items
         * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
         */
        readonly items: Elements.LinkedItemsElement<ContentType_circular_reference_type_a_b>;
    },
    'circular_reference_type_b____a'
>;

/**
 * Type representing all available element codenames for Circular reference type B -> A
 */
export type ContentType_circular_reference_type_b____aElementCodenames = 'items';

/**
 * Type guard for Circular reference type B -> A
 *
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 * Codename: circular_reference_type_b____a
 */
export function isContentType_circular_reference_type_b____aItem(
    item: CoreItem | undefined | null
): item is ContentType_circular_reference_type_b____a {
    return item?.system?.type === 'circular_reference_type_b____a';
}
