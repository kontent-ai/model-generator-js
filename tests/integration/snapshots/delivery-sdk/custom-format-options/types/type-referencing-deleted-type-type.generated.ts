import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Type referencing deleted type' type
 */
export type TypeReferencingDeletedTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">;

/*
 * Typeguard for codename of 'Type referencing deleted type' type
 */
export function isTypeReferencingDeletedTypeTypeCodename(
	value: string | undefined | null,
): value is TypeReferencingDeletedTypeTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeTypeCodename);
}

/*
 * Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export type TypeReferencingDeletedTypeType = ContentItemOf<
	CoreClientSchema,
	TypeReferencingDeletedTypeTypeCodename,
	{
		/*
		 * Rich text with invalid type
		 *
		 * Codename: rich_text_with_invalid_type
		 * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
		 * Type: rich_text
		 * Required: false
		 */
		readonly rich_text_with_invalid_type: Elements.RichText<CoreType>;

		/*
		 * Linked items with invalid type
		 *
		 * Codename: linked_items_with_invalid_type
		 * Id: cc310017-de8b-42f1-962b-63959367d29a
		 * Type: modular_content
		 * Required: false
		 */
		readonly linked_items_with_invalid_type: Elements.LinkedItems<CoreType>;
	}
>;

/*
 * Type representing all available element codenames for Type referencing deleted type
 */
export type TypeReferencingDeletedTypeTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type";

/*
 * Type guard for Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export function isTypeReferencingDeletedTypeType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeReferencingDeletedTypeType {
	return isTypeReferencingDeletedTypeTypeCodename(item?.system.type);
}
