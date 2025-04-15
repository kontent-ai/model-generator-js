
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of Subpages Element
 * 
* Codename: subpages
*/
export type SubpagesElementCodename = Extract<ElementCodenames, 'subpages'>;

/**
 * Type guard for Subpages entity
 * 
* Codename: subpages
*/
export function isSubpagesElementCodename(value: string | undefined | null): value is SubpagesElementCodename {
                return typeof value === 'string' && value === ('subpages' satisfies SubpagesElementCodename);
            }

