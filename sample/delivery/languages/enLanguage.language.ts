/*
 * This file has been auto-generated by '@kontent-ai/sync-sdk@{{version}}'.
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
 */

import type { LanguageCodenames } from "./_languages.js"

/*
 * Type representing codename of 'English' language
 */
export type EnLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "en">

/*
 * Typeguard for codename of 'English' language
 */
export function isEnLanguageCodename(value: string | undefined | null): value is EnLanguageCodename {
	return typeof value === "string" && value === ("en" satisfies EnLanguageCodename)
}
