import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreItem, TypeCodenames } from "../system/types.generated.js";

export type TypeReferencingDeletedTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">;

export function isTypeReferencingDeletedTypeCodename(value: string | undefined | null): value is TypeReferencingDeletedTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeCodename);
}

export type TypeReferencingDeletedTypeItem = ContentItemOf<
	CoreClientSchema,
	TypeReferencingDeletedTypeCodename,
	{
		readonly rich_text_with_invalid_type: Elements.RichText<CoreItem>;

		readonly linked_items_with_invalid_type: Elements.LinkedItems<CoreItem>;
	}
>;

export type TypeReferencingDeletedTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type";

export function isTypeReferencingDeletedTypeItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeReferencingDeletedTypeItem {
	return isTypeReferencingDeletedTypeCodename(item?.system.type);
}
