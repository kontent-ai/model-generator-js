
            import type { CollectionCodenames } from './_collections.js';
           
    
            /*
                * Type representing codename of Legacy collection
                * 
                * Codename: legacy_collection
                */
            export type LegacyCollectionCollectionCodename = Extract<CollectionCodenames, 'legacy_collection'>;

            /*
                * Type guard for Legacy collection
                * 
                * Codename: legacy_collection
            */
            export function isLegacyCollectionCollectionCodename(value: string | undefined | null): value is LegacyCollectionCollectionCodename {
                return typeof value === 'string' && value === ('legacy_collection' satisfies LegacyCollectionCollectionCodename);
            }
            
            