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
 * Array of all collection codenames
 */
export const collectionCodenames = ["default"] as const

/*
 * Type representing all collection codenames
 */
export type CollectionCodenames = (typeof collectionCodenames)[number]

/*
 * Typeguard for collection codename
 */
export function isCollectionCodename(value: string | undefined | null): value is CollectionCodenames {
	return typeof value === "string" && (collectionCodenames as readonly string[]).includes(value)
}
