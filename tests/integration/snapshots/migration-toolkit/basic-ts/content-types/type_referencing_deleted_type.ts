import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.ts';

/**
 * Type referencing deleted type
 *
 * Codename: type_referencing_deleted_type
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 */
export type TypeReferencingDeletedTypeItem = CoreMigrationItem<
    'type_referencing_deleted_type',
    {
        /**
         * Rich text with invalid type
         *
         * Type: rich_text
         * Required: false
         * Codename: rich_text_with_invalid_type
         * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
         */
        readonly rich_text_with_invalid_type: MigrationElementModels.RichTextElement;

        /**
         * Linked items with invalid type
         *
         * Type: modular_content
         * Required: false
         * Codename: linked_items_with_invalid_type
         * Id: cc310017-de8b-42f1-962b-63959367d29a
         */
        readonly linked_items_with_invalid_type: MigrationElementModels.LinkedItemsElement;
    }
>;
