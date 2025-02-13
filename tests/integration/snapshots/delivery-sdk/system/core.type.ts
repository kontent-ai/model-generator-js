import type { IContentItem, IContentItemElements, IDeliveryClient } from '@kontent-ai/delivery-sdk';
import type {
    ContentTypeCodenames,
    CollectionCodenames,
    LanguageCodenames,
    WorkflowCodenames,
    WorkflowStepCodenames,
    ElementCodenames,
    TaxonomyCodenames
} from './delivery.codenames.js';

/**
 * Core content type used in favor of default 'IContentItem'
 */
export type CoreContentType<
    TElements extends IContentItemElements = IContentItemElements,
    TContentTypeCodename extends ContentTypeCodenames = ContentTypeCodenames
> = IContentItem<TElements, TContentTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>;

/**
 * Core delivery client in favor of default 'IDeliveryClient'
 */
export type CoreDeliveryClient = IDeliveryClient<{
    readonly collectionCodenames: CollectionCodenames;
    readonly contentItemType: CoreContentType;
    readonly contentTypeCodenames: ContentTypeCodenames;
    readonly elementCodenames: ElementCodenames;
    readonly languageCodenames: LanguageCodenames;
    readonly taxonomyCodenames: TaxonomyCodenames;
    readonly workflowCodenames: WorkflowCodenames;
    readonly worfklowStepCodenames: WorkflowStepCodenames;
}>;
