import type { CollectionCodenames } from './_collections.ts';

/*
 * Type representing codename of entity
 *
 * Name: Default
 * Codename: default
 * Type: Collection
 */
export type DefaultCollectionCodename = Extract<CollectionCodenames, 'default'>;

/*
 * Typeguard function for entity
 *
 * Name: Default
 * Codename: default
 * Type: Collection
 */
export function isDefaultCollectionCodename(value: string | undefined | null): value is DefaultCollectionCodename {
	return typeof value === 'string' && value === ('default' satisfies DefaultCollectionCodename);
}
