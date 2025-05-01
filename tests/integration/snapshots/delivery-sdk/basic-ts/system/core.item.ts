import type { IContentItem, IContentItemElements, IDeliveryClient } from '@kontent-ai/delivery-sdk';
import type { CollectionCodenames } from '../collections/_collections.ts';
import type { LanguageCodenames } from '../languages/_languages.ts';
import type { WorkflowCodenames, WorkflowStepCodenames } from '../workflows/_workflows.ts';
import type { TaxonomyCodenames } from '../taxonomies/_taxonomies.ts';
import type { ContentTypeCodenames } from '../contentTypes/_contentTypes.ts';
import type { ElementCodenames } from '../elements/_elements.ts';

/*
 * Core content type used in favor of default 'IContentItem'
 */
export type CoreItem<
	TElementCodenames extends string = string,
	TElements extends IContentItemElements<TElementCodenames> = IContentItemElements<TElementCodenames>,
	TContentTypeCodename extends ContentTypeCodenames = ContentTypeCodenames
> = IContentItem<TElements, TContentTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>;

/*
 * Core types for 'IDeliveryClient'
 */
export type CoreClientTypes = {
	readonly collectionCodenames: CollectionCodenames;
	readonly contentItemType: CoreItem;
	readonly contentTypeCodenames: ContentTypeCodenames;
	readonly elementCodenames: ElementCodenames;
	readonly languageCodenames: LanguageCodenames;
	readonly taxonomyCodenames: TaxonomyCodenames;
	readonly workflowCodenames: WorkflowCodenames;
	readonly workflowStepCodenames: WorkflowStepCodenames;
};

/*
 * Typed delivery client in favor of default 'IDeliveryClient'
 */
export type CoreDeliveryClient = IDeliveryClient<CoreClientTypes>;
