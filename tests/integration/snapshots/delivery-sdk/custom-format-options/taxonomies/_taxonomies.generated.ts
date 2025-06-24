
            
            /*
* Array of all taxonomy codenames
*/
            export const taxonomyCodenames = ['taxonomy_a', 'taxonomy_without_terms'] as const;;
           
            /*
* Type representing all taxonomy codenames
*/
            export type TaxonomyCodenames = typeof taxonomyCodenames[number];;

            /*
* Typeguard for taxonomy codename
*/
            export function isTaxonomyCodename(value: string | undefined | null): value is TaxonomyCodenames {
                return typeof value === 'string' && (taxonomyCodenames as readonly string[]).includes(value);
            };
            