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

/*
 * Array of all language codenames
 */
export const languageCodenames = ["en", "cz", "German"] as const

/*
 * Type representing all language codenames
 */
export type LanguageCodenames = (typeof languageCodenames)[number]

/*
 * Typeguard for language codename
 */
export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
	return typeof value === "string" && (languageCodenames as readonly string[]).includes(value)
}
