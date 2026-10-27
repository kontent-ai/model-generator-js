import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { CircularReferenceTypeABItem } from "../types/circular-reference-type-a-b-type.generated.js";

export type CircularReferenceTypeBACodename = keyof Pick<Record<TypeCodenames, null>, "circular_reference_type_b____a">;

export function isCircularReferenceTypeBACodename(value: string | undefined | null): value is CircularReferenceTypeBACodename {
	return typeof value === "string" && value === ("circular_reference_type_b____a" satisfies CircularReferenceTypeBACodename);
}

export type CircularReferenceTypeBAItem = ContentItemOf<
	CoreClientSchema,
	CircularReferenceTypeBACodename,
	{
		readonly items: Elements.LinkedItems<CircularReferenceTypeABItem>;
	}
>;

export type CircularReferenceTypeBAElementCodenames = "items";

export function isCircularReferenceTypeBAItem(
	item: ContentItemPayload<CoreClientSchema> | undefined | null,
): item is CircularReferenceTypeBAItem {
	return isCircularReferenceTypeBACodename(item?.system.type);
}
