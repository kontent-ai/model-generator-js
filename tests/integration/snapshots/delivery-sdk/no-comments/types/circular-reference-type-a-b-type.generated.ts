import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";
import type { CircularReferenceTypeBAType } from "../types/circular-reference-type-b-a-type.generated.js";

export type CircularReferenceTypeABTypeCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_a_b">;

export function isCircularReferenceTypeABTypeCodename(value: string | undefined | null): value is CircularReferenceTypeABTypeCodename {
	return typeof value === "string" && value === ("circular_reference_type_a_b" satisfies CircularReferenceTypeABTypeCodename);
}

export type CircularReferenceTypeABType = IContentItem<
	{
		readonly items: Elements.LinkedItemsElement<CircularReferenceTypeBAType>;
	},
	CircularReferenceTypeABTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type CircularReferenceTypeABTypeElementCodenames = "items";

export function isCircularReferenceTypeABType(item: IContentItem | undefined | null): item is CircularReferenceTypeABType {
	return item?.system.type === ("circular_reference_type_a_b" satisfies CircularReferenceTypeABTypeCodename);
}
