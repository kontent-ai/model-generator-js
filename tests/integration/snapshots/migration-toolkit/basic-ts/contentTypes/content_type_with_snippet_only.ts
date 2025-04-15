import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { CoreMigrationItem } from '../migration.ts';

/**
 * Content type with snippet only
 *
 * Codename: content_type_with_snippet_only
 * Id: 7fd86bef-8f30-4a02-a1c3-fb130f65e9b4
 */
export type ContentTypeWithSnippetOnlyItem = CoreMigrationItem<
    'content_type_with_snippet_only',
    {
        /**
         * Linked items with specific types
         *
         * Type: modular_content
         * Required: false
         * Codename: snippet_a__linked_items_with_specific_types
         * Id: 140130dc-84c1-455f-99ab-d31579cf90d1
         */
        readonly snippet_a__linked_items_with_specific_types: MigrationElementModels.LinkedItemsElement;

        /**
         * Text
         *
         * Type: text
         * Required: true
         * Codename: snippet_a__text
         * Id: 873e4a7a-e2ea-49a0-b88e-2ff7b6892f60
         */
        readonly snippet_a__text: MigrationElementModels.TextElement;
    }
>;
