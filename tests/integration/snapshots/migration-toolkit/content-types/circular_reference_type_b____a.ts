import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { Item } from '../migration.js';

/**
 * Circular reference type B -> A
 *
 * Codename: circular_reference_type_b____a
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 */
export type CircularReferenceTypeBAItem = Item<
    'circular_reference_type_b____a',
    {
        /**
         * Items
         *
         * Type: modular_content
         * Required: false
         * Codename: items
         * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
         */
        readonly items: MigrationElementModels.LinkedItemsElement;
    }
>;
