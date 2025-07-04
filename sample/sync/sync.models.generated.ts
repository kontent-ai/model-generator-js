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

import type { SyncClient, SyncClientTypes } from "@kontent-ai/sync-sdk"

/*
 * Use as generic type when creating a sync client for increased type safety
 */
export type CoreSyncClientTypes = SyncClientTypes & {
	readonly languageCodenames: "cz" | "en" | "German"
	readonly typeCodenames: "actor" | "movie"
	readonly workflowCodenames: "default"
	readonly workflowStepCodenames: "draft" | "ready_to_publish" | "review"
	readonly collectionCodenames: "default"
	readonly taxonomyCodenames: "movietype" | "releasecategory"
}

/*
 * Type safe sync client
 */
export type CoreSyncClient = SyncClient<CoreSyncClientTypes>
