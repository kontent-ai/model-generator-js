import type { IContentItem, IContentItemElements } from '@kontent-ai/delivery-sdk';
import type {
    ContentTypeCodenames,
    CollectionCodenames,
    LanguageCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames
} from './delivery.codenames.js';

/**
 * Core content type used in favor of generic 'IContentItem'
 */
export type CoreContentType<
    TElements extends IContentItemElements = IContentItemElements,
    TContentTypeCodename extends ContentTypeCodenames = ContentTypeCodenames
> = IContentItem<TElements, TContentTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>;
