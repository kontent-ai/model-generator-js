
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of Taxonomy A Element
 * 
* Codename: taxonomy_element
*/
export type TaxonomyAElementCodename = Extract<ElementCodenames, 'taxonomy_element'>;

/**
 * Type guard for Taxonomy A entity
 * 
* Codename: taxonomy_element
*/
export function isTaxonomyAElementCodename(value: string | undefined | null): value is TaxonomyAElementCodename {
                return typeof value === 'string' && value === ('taxonomy_element' satisfies TaxonomyAElementCodename);
            }

