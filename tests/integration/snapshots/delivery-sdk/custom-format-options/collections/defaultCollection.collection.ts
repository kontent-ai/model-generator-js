
            import type { CollectionCodenames } from './_collections.js';
           
            /*
* Type representing codename of 'Default' collection
*/
            export type DefaultCollectionCodename = keyof Pick<Record<CollectionCodenames, null>, "default">;

            /*
* Typeguard for codename of 'Default' collection
*/
            export function isDefaultCollectionCodename(value: string | undefined | null): value is DefaultCollectionCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultCollectionCodename);
            }
            