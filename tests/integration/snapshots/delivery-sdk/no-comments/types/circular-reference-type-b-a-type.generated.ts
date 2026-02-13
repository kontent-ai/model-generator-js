import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";
import type { CircularReferenceTypeABType } from "../types/circular-reference-type-a-b-type.generated.js";

export type CircularReferenceTypeBATypeCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">;

export function isCircularReferenceTypeBATypeCodename(value: string | undefined | null): value is CircularReferenceTypeBATypeCodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBATypeCodename);
}

export type CircularReferenceTypeBAType = IContentItem<
	{
		readonly items: Elements.LinkedItemsElement<CircularReferenceTypeABType>;
	},
	CircularReferenceTypeBATypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type CircularReferenceTypeBATypeElementCodenames = "items";

export function isCircularReferenceTypeBAType(item: IContentItem | undefined | null): item is CircularReferenceTypeBAType {
	return item?.system.type === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBATypeCodename);
}
