import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: Type referencing deleted type
 * Codename: type_referencing_deleted_type
 * Type: Type
 */
export type TypeReferencingDeletedTypeTypeCodename = Extract<TypeCodenames, 'type_referencing_deleted_type'>;

/*
 * Type guard for Type referencing deleted type
 *
 * Name: Type referencing deleted type
 * Codename: type_referencing_deleted_type
 * Type: Type
 */
export function isTypeReferencingDeletedTypeTypeCodename(
	value: string | undefined | null
): value is TypeReferencingDeletedTypeTypeCodename {
	return typeof value === 'string' && value === ('type_referencing_deleted_type' satisfies TypeReferencingDeletedTypeTypeCodename);
}

/*
 * Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export type TypeReferencingDeletedTypeType = CoreType<
	TypeReferencingDeletedTypeTypeElementCodenames,
	{
		/*
		 * Rich text with invalid type
		 *
		 * Type: rich_text
		 * Required: false
		 * Codename: rich_text_with_invalid_type
		 * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
		 */
		readonly rich_text_with_invalid_type: Elements.RichTextElement<CoreType>;
		/*
		 * Linked items with invalid type
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: linked_items_with_invalid_type
		 * Id: cc310017-de8b-42f1-962b-63959367d29a
		 */
		readonly linked_items_with_invalid_type: Elements.LinkedItemsElement<CoreType>;
	},
	TypeReferencingDeletedTypeTypeCodename
>;

/*
 * Type representing all available element codenames for Type referencing deleted type
 */
export type TypeReferencingDeletedTypeTypeElementCodenames = 'rich_text_with_invalid_type' | 'linked_items_with_invalid_type';

/*
 * Type guard for Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export function isTypeReferencingDeletedTypeType(item: CoreType | undefined | null): item is TypeReferencingDeletedTypeType {
	return item?.system?.type === 'type_referencing_deleted_type';
}
