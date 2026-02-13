import type { CollectionCodenames } from "../system/collections.generated.js";

/*
 * Type representing codename of 'Legacy collection' collection
 */
export type LegacyCollectionCollectionCodename = keyof Pick<Record<CollectionCodenames, null>, "legacy_collection">;

/*
 * Typeguard for codename of 'Legacy collection' collection
 */
export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
	return typeof value === "string" && value === ("legacy_collection" satisfies LegacyCollectionCollectionCodename);
}
