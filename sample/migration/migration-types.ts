import type { MigrationItemSystem, MigrationItem, MigrationElements } from '@kontent-ai/migration-toolkit';

export type LanguageCodenames = 'cz' | 'en' | 'German';
export type ContentTypeCodenames = 'actor' | 'movie';
export type CollectionCodenames = 'default';
export type WorkflowCodenames = 'default';
export type WorkflowStepCodenames = 'draft' | 'review' | 'ready_to_publish' | 'published' | 'archived' | 'scheduled';
export type System<Codename extends ContentTypeCodenames> = MigrationItemSystem<
    Codename,
    LanguageCodenames,
    CollectionCodenames,
    WorkflowCodenames
>;
export type Item<
    Codename extends ContentTypeCodenames,
    TElements extends MigrationElements = MigrationElements
> = MigrationItem<TElements, System<Codename>, WorkflowStepCodenames>;
