import type { CollectionCodenames } from "../system/collections.generated.js";

export type DefaultCollectionCodename = keyof Pick<Record<CollectionCodenames, null>, "default">;

export function isDefaultCollectionCodename(value: string | undefined | null): value is DefaultCollectionCodename {
	return typeof value === "string" && value === ("default" satisfies DefaultCollectionCodename);
}
