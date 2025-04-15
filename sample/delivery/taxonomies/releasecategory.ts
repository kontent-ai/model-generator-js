
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

import type { TaxonomyCodenames } from './core.taxonomy.js';

/**
 * Type representing Taxonomy entities
 *
 * Codename: releasecategory
 * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
 */
export type ReleaseCategoryTaxonomy = Extract<TaxonomyCodenames, 'releasecategory'>;

/**
 * Type guard for ReleaseCategory entity
 *
 * Codename: releasecategory
 * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
 */
export function isReleaseCategoryTaxonomy(value: string | undefined | null): value is ReleaseCategoryTaxonomy {
    return typeof value === 'string' && value === ('releasecategory' satisfies ReleaseCategoryTaxonomy);
}
