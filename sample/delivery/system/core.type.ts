
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.1.1'.
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
    TElementCodenames extends string = string,
    TElements extends IContentItemElements<TElementCodenames> = IContentItemElements<TElementCodenames>,
    TContentTypeCodename extends ContentTypeCodenames = ContentTypeCodenames
> = IContentItem<TElements, TContentTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>;

/**
 * Core types for 'IDeliveryClient'
 */
export type CoreClientTypes = {
    readonly collectionCodenames: CollectionCodenames;
    readonly contentItemType: CoreContentType;
    readonly contentTypeCodenames: ContentTypeCodenames;
    readonly elementCodenames: ElementCodenames;
    readonly languageCodenames: LanguageCodenames;
    readonly taxonomyCodenames: TaxonomyCodenames;
    readonly workflowCodenames: WorkflowCodenames;
    readonly workflowStepCodenames: WorkflowStepCodenames;
};

/**
 * Typed delivery client in favor of default 'IDeliveryClient'
 */
export type CoreDeliveryClient = IDeliveryClient<CoreClientTypes>;
