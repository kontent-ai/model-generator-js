
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of Number element Element
 * 
* Codename: number_element
*/
export type NumberElementElementCodename = Extract<ElementCodenames, 'number_element'>;

/**
 * Type guard for Number element entity
 * 
* Codename: number_element
*/
export function isNumberElementElementCodename(value: string | undefined | null): value is NumberElementElementCodename {
                return typeof value === 'string' && value === ('number_element' satisfies NumberElementElementCodename);
            }

