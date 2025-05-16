
            import type { CollectionCodenames } from './_collections.js';
           
            /*
    * Type representing codename of entity
    *
    * Name: Legacy collection
* Codename: legacy_collection
* Type: Collection
    */
            export type LegacyCollectionCollectionCodename = Extract<CollectionCodenames, 'legacy_collection'>;

            /*
    * Typeguard function for entity
    *
    * Name: Legacy collection
* Codename: legacy_collection
* Type: Collection
    */
            export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
                return typeof value === 'string' && value === ('legacy_collection' satisfies LegacyCollectionCollectionCodename);
            }
            