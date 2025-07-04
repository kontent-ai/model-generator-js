import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { CoreType, TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"

/*
 * Type representing codename of 'Type referencing deleted type' type
 */
export type ContentTypeTypeReferencingDeletedTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">

/*
 * Typeguard for codename of 'Type referencing deleted type' type
 */
export function isContentTypeTypeReferencingDeletedTypeCodename(
	value: string | undefined | null
): value is ContentTypeTypeReferencingDeletedTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies ContentTypeTypeReferencingDeletedTypeCodename)
}

/*
 * Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export type ContentTypeTypeReferencingDeletedType = IContentItem<
	{
		/*
		 * Rich text with invalid type
		 *
		 * Codename: rich_text_with_invalid_type
		 * Id: 03df7457-fb30-4d4e-aee2-06b0e1f218a2
		 * Type: rich_text
		 * Required: false
		 */
		readonly rich_text_with_invalid_type: Elements.RichTextElement<CoreType>

		/*
		 * Linked items with invalid type
		 *
		 * Codename: linked_items_with_invalid_type
		 * Id: cc310017-de8b-42f1-962b-63959367d29a
		 * Type: modular_content
		 * Required: false
		 */
		readonly linked_items_with_invalid_type: Elements.LinkedItemsElement<CoreType>
	},
	ContentTypeTypeReferencingDeletedTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Type referencing deleted type
 */
export type ContentTypeTypeReferencingDeletedTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type"

/*
 * Type guard for Type referencing deleted type
 *
 * Id: f7562083-7230-4c20-9136-620ee7a92534
 * Codename: type_referencing_deleted_type
 */
export function isContentTypeTypeReferencingDeletedType(
	item: IContentItem | undefined | null
): item is ContentTypeTypeReferencingDeletedType {
	return item?.system.type === ("type_referencing_deleted_type" satisfies ContentTypeTypeReferencingDeletedTypeCodename)
}
