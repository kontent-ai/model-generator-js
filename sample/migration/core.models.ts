import type { MigrationItemSystem, MigrationItem, MigrationElements } from '@kontent-ai/migration-toolkit';

/**
 *
 * Migration Toolkit - tests
 *
 * Environment: Production
 * Id: 5ddb8f47-a51f-0124-35b1-f6634fa91ae2
 */

/**
 * Type representing all languages
 */
export type LanguageCodenames = 'en' | 'es';

/**
 * Type representing all content types
 */
export type ContentTypeCodenames = 'actor' | 'movie' | 'test';

/**
 * Type representing all collections
 */
export type CollectionCodenames = 'default';

/**
 * Type representing all workflows
 */
export type WorkflowCodenames = 'default' | 'my_test_workflow';

/**
 * Type representing all worksflow steps across all workflows
 */
export type WorkflowStepCodenames =
    | 'draft'
    | 'ready_to_publish'
    | 'published'
    | 'archived'
    | 'scheduled'
    | 'draft_3171da5'
    | 'ready_for_review';

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
