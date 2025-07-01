
            
            /*
* Array of all collection codenames
*/
            export const collectionCodenames = ['legacy_collection', 'default'] as const;;
           
            /*
* Type representing all collection codenames
*/
            export type CollectionCodenames = typeof collectionCodenames[number];;

            /*
* Typeguard for collection codename
*/
            export function isCollectionCodename(value: string | undefined | null): value is CollectionCodenames {
                return typeof value === 'string' && (collectionCodenames as readonly string[]).includes(value);
            };