import type { CollectionCodenames } from './_collections.ts';

/**
 * Type representing codename of Default Collection
 *
 * Codename: default
 */
export type DefaultCollectionCodename = Extract<CollectionCodenames, 'default'>;

/**
 * Type guard for Default entity
 *
 * Codename: default
 */
export function isDefaultCollectionCodename(value: string | undefined | null): value is DefaultCollectionCodename {
    return typeof value === 'string' && value === ('default' satisfies DefaultCollectionCodename);
}
