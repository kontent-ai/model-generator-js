import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { CircularReferenceTypeABType } from "../types/circular-reference-type-a-b-type.generated.js";

export type CircularReferenceTypeBATypeCodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">;

export function isCircularReferenceTypeBATypeCodename(value: string | undefined | null): value is CircularReferenceTypeBATypeCodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBATypeCodename);
}

export type CircularReferenceTypeBAType = ContentItemOf<
	CoreClientSchema,
	CircularReferenceTypeBATypeCodename,
	{
		readonly items: Elements.LinkedItems<CircularReferenceTypeABType>;
	}
>;

export type CircularReferenceTypeBATypeElementCodenames = "items";

export function isCircularReferenceTypeBAType(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is CircularReferenceTypeBAType {
	return isCircularReferenceTypeBATypeCodename(item?.system.type);
}
