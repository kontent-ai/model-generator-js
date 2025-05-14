
            import type { TaxonomyCodenames } from './_taxonomies.js';
           
    
            /*
                * Type representing codename of Taxonomy A
                * 
                * Codename: taxonomy_a
                */
            export type TaxonomyATaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_a'>;

            /*
                * Type guard for Taxonomy A
                * 
                * Codename: taxonomy_a
            */
            export function isTaxonomyATaxonomyCodename(value: string | undefined | null): value is TaxonomyATaxonomyCodename {
                return typeof value === 'string' && value === ('taxonomy_a' satisfies TaxonomyATaxonomyCodename);
            }

            /*
                * Object with all values of Taxonomy codenames in Taxonomy A Term
            */
            export const taxonomyATermCodenames = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;;

            /*
                * Type representing Taxonomy codenames in Taxonomy A Term
            */
            export type TaxonomyATermCodenames = typeof taxonomyATermCodenames[number];

            /*
                * Type guard for Taxonomy codenames in Taxonomy A Term
            */
            export function isTaxonomyATermCodename(value: string | undefined | null): value is TaxonomyATermCodenames {
                return typeof value === 'string' && (taxonomyATermCodenames as readonly string[]).includes(value);
            };
            
            