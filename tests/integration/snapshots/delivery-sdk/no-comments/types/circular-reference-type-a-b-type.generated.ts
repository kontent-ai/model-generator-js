import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { CircularReferenceTypeBAItem } from "../types/circular-reference-type-b-a-type.generated.js";

export type CircularReferenceTypeABCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_a_b">;

export function isCircularReferenceTypeABCodename(value: string | undefined | null): value is CircularReferenceTypeABCodename {
	return typeof value === "string" && value === ("circular_reference_type_a_b" satisfies CircularReferenceTypeABCodename);
}

export type CircularReferenceTypeABItem = ContentItemOf<
	CoreClientSchema,
	CircularReferenceTypeABCodename,
	{
		readonly items: Elements.LinkedItems<CircularReferenceTypeBAItem>;
	}
>;

export type CircularReferenceTypeABElementCodenames = "items";

export function isCircularReferenceTypeABItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is CircularReferenceTypeABItem {
	return isCircularReferenceTypeABCodename(item?.system.type);
}
