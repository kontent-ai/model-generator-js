import type { CollectionCodenames } from './_collections.ts';

/*
 * Type representing codename of 'Legacy collection' collection
 */
export type LegacyCollectionCollectionCodename = Extract<CollectionCodenames, 'legacy_collection'>;

/*
 * Typeguard for codename of 'Legacy collection' collection
 */
export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
	return typeof value === 'string' && value === ('legacy_collection' satisfies LegacyCollectionCollectionCodename);
}
