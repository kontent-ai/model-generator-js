
            
            /*
                * Object with all values of Taxonomy codenames 
            */
            export const taxonomyCodenames = ['taxonomy_a', 'taxonomy_without_terms'] as const;;

            /*
                * Type representing Taxonomy codenames 
            */
            export type TaxonomyCodenames = typeof taxonomyCodenames[number];

            /*
                * Type guard for Taxonomy codenames 
            */
            export function isTaxonomyCodename(value: string | undefined | null): value is TaxonomyCodenames {
                return typeof value === 'string' && (taxonomyCodenames as readonly string[]).includes(value);
            };
            