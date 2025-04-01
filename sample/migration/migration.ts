
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.0.0'.
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

import type { MigrationItem, MigrationItemSystem, MigrationElements } from '@kontent-ai/migration-toolkit';
import type {
    CollectionCodenames,
    ContentTypeCodenames,
    LanguageCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames
} from './environment/environment.js';

/**
 * System object shared by all individual content type models
 */
export type CoreMigrationItemSystem<TCodename extends ContentTypeCodenames> = MigrationItemSystem<
    TCodename,
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames
>;

/**
 * Item object shared by all individual content type models
 */
export type CoreMigrationItem<
    TCodename extends ContentTypeCodenames,
    TElements extends MigrationElements = MigrationElements
> = MigrationItem<TElements, CoreMigrationItemSystem<TCodename>, WorkflowStepCodenames>;
