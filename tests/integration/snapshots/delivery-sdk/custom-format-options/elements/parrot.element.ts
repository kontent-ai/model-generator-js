
import type { ElementCodenames } from './_elements.js';
    
 /**
 * Type representing codename of 🦜Parrot_emoji Element
 * 
* Codename: parrot__
*/
export type ParrotEmojiElementCodename = Extract<ElementCodenames, 'parrot__'>;

/**
 * Type guard for 🦜Parrot_emoji entity
 * 
* Codename: parrot__
*/
export function isParrotEmojiElementCodename(value: string | undefined | null): value is ParrotEmojiElementCodename {
                return typeof value === 'string' && value === ('parrot__' satisfies ParrotEmojiElementCodename);
            }

