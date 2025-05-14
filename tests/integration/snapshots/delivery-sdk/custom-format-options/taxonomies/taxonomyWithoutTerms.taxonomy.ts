
            import type { TaxonomyCodenames } from './_taxonomies.js';
           
    
            /*
                * Type representing codename of Taxonomy without terms
                * 
                * Codename: taxonomy_without_terms
                */
            export type TaxonomyWithoutTermsTaxonomyCodename = Extract<TaxonomyCodenames, 'taxonomy_without_terms'>;

            /*
                * Type guard for Taxonomy without terms
                * 
                * Codename: taxonomy_without_terms
            */
            export function isTaxonomyWithoutTermsTaxonomyCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTaxonomyCodename {
                return typeof value === 'string' && value === ('taxonomy_without_terms' satisfies TaxonomyWithoutTermsTaxonomyCodename);
            }

            /*
                * Object with all values of Taxonomy codenames in Taxonomy without terms Term
            */
            export const taxonomyWithoutTermsTermCodenames = [] as const;;

            /*
                * Type representing Taxonomy codenames in Taxonomy without terms Term
            */
            export type TaxonomyWithoutTermsTermCodenames = typeof taxonomyWithoutTermsTermCodenames[number];

            /*
                * Type guard for Taxonomy codenames in Taxonomy without terms Term
            */
            export function isTaxonomyWithoutTermsTermCodename(value: string | undefined | null): value is TaxonomyWithoutTermsTermCodenames {
                return typeof value === 'string' && (taxonomyWithoutTermsTermCodenames as readonly string[]).includes(value);
            };
            
            