/**
 * This file has been auto-generated by '@kontent-ai/model-generator@7.4.0'.
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

import type { MigrationItemSystem, MigrationItem, MigrationElements } from '@kontent-ai/migration-toolkit';

/**
 * Type representing all languages
 */
export type LanguageCodenames = 'cz' | 'en' | 'German';

/**
 * Type representing all content types
 */
export type ContentTypeCodenames = 'actor' | 'movie';

/**
 * Type representing all collections
 */
export type CollectionCodenames = 'default';

/**
 * Type representing all workflows
 */
export type WorkflowCodenames = 'default';

/**
 * Type representing all worksflow steps across all workflows
 */
export type WorkflowStepCodenames = 'draft' | 'review' | 'ready_to_publish' | 'published' | 'archived' | 'scheduled';

/**
 * System object shared by all individual content type models
 */
export type System<Codename extends ContentTypeCodenames> = MigrationItemSystem<
    Codename,
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames
>;

/**
 * Item object shared by all individual content type models
 */
export type Item<
    Codename extends ContentTypeCodenames,
    TElements extends MigrationElements = MigrationElements
> = MigrationItem<TElements, System<Codename>, WorkflowStepCodenames>;
