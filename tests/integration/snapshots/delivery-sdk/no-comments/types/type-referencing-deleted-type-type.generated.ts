import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";

export type TypeReferencingDeletedTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">;

export function isTypeReferencingDeletedTypeTypeCodename(
	value: string | undefined | null,
): value is TypeReferencingDeletedTypeTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeTypeCodename);
}

export type TypeReferencingDeletedTypeType = ContentItemOf<
	CoreClientSchema,
	TypeReferencingDeletedTypeTypeCodename,
	{
		readonly rich_text_with_invalid_type: Elements.RichText<CoreType>;

		readonly linked_items_with_invalid_type: Elements.LinkedItems<CoreType>;
	}
>;

export type TypeReferencingDeletedTypeTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type";

export function isTypeReferencingDeletedTypeType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is TypeReferencingDeletedTypeType {
	return isTypeReferencingDeletedTypeTypeCodename(item?.system.type);
}
