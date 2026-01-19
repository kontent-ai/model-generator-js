import type { CollectionCodenames } from "../system/collections.generated.js";

export type LegacyCollectionCollectionCodename = keyof Pick<Record<CollectionCodenames, null>, "legacy_collection">;

export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
	return typeof value === "string" && value === ("legacy_collection" satisfies LegacyCollectionCollectionCodename);
}
