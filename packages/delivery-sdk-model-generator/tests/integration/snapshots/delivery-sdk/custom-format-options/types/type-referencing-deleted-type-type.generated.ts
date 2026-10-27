import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreItem, TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Type referencing deleted type' type
 */
export type TypeReferencingDeletedTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">;

/*
 * Typeguard for codename of 'Type referencing deleted type' type
 */
export function isTypeReferencingDeletedTypeCodename(value: string | undefined | null): value is TypeReferencingDeletedTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeCodename);
}

/*
 * Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export type TypeReferencingDeletedTypeItem = ContentItemOf<
	CoreClientSchema,
	TypeReferencingDeletedTypeCodename,
	{
		/*
		 * Rich text with invalid type
		 *
		 * Codename: rich_text_with_invalid_type
		 * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
		 * Type: rich_text
		 * Required: false
		 */
		readonly rich_text_with_invalid_type: Elements.RichText<CoreItem>;

		/*
		 * Linked items with invalid type
		 *
		 * Codename: linked_items_with_invalid_type
		 * Id: cc310017-de8b-42f1-962b-63959367d29a
		 * Type: modular_content
		 * Required: false
		 */
		readonly linked_items_with_invalid_type: Elements.LinkedItems<CoreItem>;
	}
>;

/*
 * Type representing all available element codenames for Type referencing deleted type
 */
export type TypeReferencingDeletedTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type";

/*
 * Type guard for Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export function isTypeReferencingDeletedTypeItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeReferencingDeletedTypeItem {
	return isTypeReferencingDeletedTypeCodename(item?.system.type);
}
