import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type TypeReferencingDeletedTypeTypeCodename = keyof Pick<Record<TypeCodenames, null>, "type_referencing_deleted_type">;

export function isTypeReferencingDeletedTypeTypeCodename(
	value: string | undefined | null,
): value is TypeReferencingDeletedTypeTypeCodename {
	return typeof value === "string" && value === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeTypeCodename);
}

export type TypeReferencingDeletedTypeType = IContentItem<
	{
		readonly rich_text_with_invalid_type: Elements.RichTextElement<CoreType>;

		readonly linked_items_with_invalid_type: Elements.LinkedItemsElement<CoreType>;
	},
	TypeReferencingDeletedTypeTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type TypeReferencingDeletedTypeTypeElementCodenames = "rich_text_with_invalid_type" | "linked_items_with_invalid_type";

export function isTypeReferencingDeletedTypeType(item: IContentItem | undefined | null): item is TypeReferencingDeletedTypeType {
	return item?.system.type === ("type_referencing_deleted_type" satisfies TypeReferencingDeletedTypeTypeCodename);
}
