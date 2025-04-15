
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~ Element
 * 
* Codename: _____numberelem_____________________
*/
export type NumberElemElementCodename = Extract<ElementCodenames, '_____numberelem_____________________'>;

/**
 * Type guard for !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~ entity
 * 
* Codename: _____numberelem_____________________
*/
export function isNumberElemElementCodename(value: string | undefined | null): value is NumberElemElementCodename {
                return typeof value === 'string' && value === ('_____numberelem_____________________' satisfies NumberElemElementCodename);
            }

