export type LanguageCodenames = 'cz' | 'en' | 'German';
export type ContentTypeCodenames = 'actor' | 'movie';
export type ContentTypeCodename<Codename extends ContentTypeCodenames> = Codename;
export type CollectionCodenames = 'default';
export type WorkflowCodenames = 'default';
export type WorkflowStepCodenames = 'draft' | 'review' | 'ready_to_publish' | 'published' | 'archived' | 'scheduled';
