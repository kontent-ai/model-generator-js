

/**
 * Object with all values of Collection codenames 
*/
export const collectionCodenames = ['legacy_collection', 'default'] as const;;

/**
 * Type representing Collection codenames 
*/
export type CollectionCodenames = typeof collectionCodenames[number];

/**
 * Type guard for Collection codenames 
*/
export function isCollectionCodename(value: string | undefined | null): value is CollectionCodenames {
                return typeof value === 'string' && (collectionCodenames as readonly string[]).includes(value);
            };


