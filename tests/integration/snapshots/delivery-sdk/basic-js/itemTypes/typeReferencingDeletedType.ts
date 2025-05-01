import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreItem } from '../system/index.js';

/*
 * Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export type TypeReferencingDeletedType = CoreItem<
	TypeReferencingDeletedTypeElementCodenames,
	{
		/*
		 * Rich text with invalid type
		 *
		 * Type: rich_text
		 * Required: false
		 * Codename: rich_text_with_invalid_type
		 * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
		 */
		readonly rich_text_with_invalid_type: Elements.RichTextElement<CoreItem>;
		/*
		 * Linked items with invalid type
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: linked_items_with_invalid_type
		 * Id: cc310017-de8b-42f1-962b-63959367d29a
		 */
		readonly linked_items_with_invalid_type: Elements.LinkedItemsElement<CoreItem>;
	},
	'type_referencing_deleted_type'
>;

/*
 * Type representing all available element codenames for Type referencing deleted type
 */
export type TypeReferencingDeletedTypeElementCodenames = 'rich_text_with_invalid_type' | 'linked_items_with_invalid_type';

/*
 * Type guard for Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export function isTypeReferencingDeletedTypeItem(item: CoreItem | undefined | null): item is TypeReferencingDeletedType {
	return item?.system?.type === 'type_referencing_deleted_type';
}
