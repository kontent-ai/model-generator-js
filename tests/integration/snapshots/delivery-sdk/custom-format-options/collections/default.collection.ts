
            import type { CollectionCodenames } from './_collections.js';
    
            /*
                * Type representing codename of Default
                * 
                * Codename: default
                */
            export type DefaultCollectionCodename = Extract<CollectionCodenames, 'default'>;

            /*
                * Type guard for Default
                * 
                * Codename: default
            */
            export function isDefaultCollectionCodename(value: string | undefined | null): value is DefaultCollectionCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultCollectionCodename);
            }
            
            