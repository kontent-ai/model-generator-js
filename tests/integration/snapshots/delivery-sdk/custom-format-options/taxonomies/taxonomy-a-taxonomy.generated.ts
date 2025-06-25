
            import type { TaxonomyCodenames } from '../system/taxonomies.generated.js';
           
            /*
* Type representing codename of 'Taxonomy A' taxonomy
*/
            export type TaxonomyATaxonomyCodename = keyof Pick<Record<TaxonomyCodenames, null>, "taxonomy_a">;

            /*
* Typeguard for codename of 'Taxonomy A' taxonomy
*/
            export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
                return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyATaxonomyCodename);
            }

            /*
* Array of all taxonomy term codenames
*/
            export const taxonomyATaxonomyTermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;;
           
            /*
* Type representing all taxonomy term codenames
*/
            export type TaxonomyATaxonomyTermCodenames = typeof taxonomyATaxonomyTermCodenames[number];;

            /*
* Typeguard for taxonomy term codename
*/
            export function isTaxonomyATaxonomyTermCodename(value: string | undefined | null): value is TaxonomyATaxonomyTermCodenames {
                return typeof value === 'string' && (taxonomyATaxonomyTermCodenames as readonly string[]).includes(value);
            };
            