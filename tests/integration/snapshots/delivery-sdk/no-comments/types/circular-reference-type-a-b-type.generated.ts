import type { TypeCodenames } from "../system/types.generated.js";
import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CircularReferenceTypeBAType } from "../types/circular-reference-type-b-a-type.generated.js";
import type { CoreClientSchema } from "../system/main.system.generated.js";

export type CircularReferenceTypeABTypeCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_a_b">;

export function isCircularReferenceTypeABTypeCodename(value: string | undefined | null): value is CircularReferenceTypeABTypeCodename {
	return typeof value === "string" && value === ("circular_reference_type_a_b" satisfies CircularReferenceTypeABTypeCodename);
}

export type CircularReferenceTypeABType = ContentItemOf<
	CoreClientSchema,
	CircularReferenceTypeABTypeCodename,
	{
		readonly items: Elements.LinkedItems<CircularReferenceTypeBAType>;
	}
>;

export type CircularReferenceTypeABTypeElementCodenames = "items";

export function isCircularReferenceTypeABType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is CircularReferenceTypeABType {
	return isCircularReferenceTypeABTypeCodename(item?.system.type);
}
