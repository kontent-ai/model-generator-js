
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of Multiple choice element Element
 * 
* Codename: multiple_choice_element
*/
export type MultipleChoiceElementElementCodename = Extract<ElementCodenames, 'multiple_choice_element'>;

/**
 * Type guard for Multiple choice element entity
 * 
* Codename: multiple_choice_element
*/
export function isMultipleChoiceElementElementCodename(value: string | undefined | null): value is MultipleChoiceElementElementCodename {
                return typeof value === 'string' && value === ('multiple_choice_element' satisfies MultipleChoiceElementElementCodename);
            }

