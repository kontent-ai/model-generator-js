
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
 * Type representing Language entities
 *
 * Codename: German
 * Id: 14f7bcc0-4fd6-4b77-8c22-70e5ccfdae1d
 */
export type GermanLanguage = Extract<LanguageCodenames, 'German'>;

/**
 * Type guard for German entity
 *
 * Codename: German
 * Id: 14f7bcc0-4fd6-4b77-8c22-70e5ccfdae1d
 */
export function isGermanLanguage(value: string | undefined | null): value is GermanLanguage {
    return typeof value === 'string' && value === ('German' satisfies GermanLanguage);
}
