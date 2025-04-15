
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.1.0'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: Movie Database
* Environment: Production
* Id: da5abe9f-fdad-4168-97cd-b3464be2ccb9
* 
* -------------------------------------------------------------------------------
**/

import type { LanguageCodenames } from './core.language.js';

/**
 * Type representing codename of cz entity
 *
 * Codename: cz
 * Id: 41ccb26f-ceab-04d0-6ffa-9c7c5358aa8f
 */
export type CzLanguageCodename = Extract<LanguageCodenames, 'cz'>;

/**
 * Type guard for cz entity
 *
 * Codename: cz
 * Id: 41ccb26f-ceab-04d0-6ffa-9c7c5358aa8f
 */
export function isCzLanguageCodename(value: string | undefined | null): value is CzLanguageCodename {
    return typeof value === 'string' && value === ('cz' satisfies CzLanguageCodename);
}
