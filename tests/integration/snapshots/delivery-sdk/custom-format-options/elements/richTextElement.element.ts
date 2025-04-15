
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of Rich text element Element
 * 
* Codename: rich_text_element
*/
export type RichTextElementElementCodename = Extract<ElementCodenames, 'rich_text_element'>;

/**
 * Type guard for Rich text element entity
 * 
* Codename: rich_text_element
*/
export function isRichTextElementElementCodename(value: string | undefined | null): value is RichTextElementElementCodename {
                return typeof value === 'string' && value === ('rich_text_element' satisfies RichTextElementElementCodename);
            }

