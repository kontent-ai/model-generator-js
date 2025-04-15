import type { CollectionCodenames } from './_collections.ts';

/**
 * Type representing codename of Legacy collection Collection
 *
 * Codename: legacy_collection
 */
export type LegacyCollectionCollectionCodename = Extract<CollectionCodenames, 'legacy_collection'>;

/**
 * Type guard for Legacy collection entity
 *
 * Codename: legacy_collection
 */
export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
    return typeof value === 'string' && value === ('legacy_collection' satisfies LegacyCollectionCollectionCodename);
}
