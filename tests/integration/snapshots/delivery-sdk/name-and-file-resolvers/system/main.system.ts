import type { IContentItem, IContentItemElements, IDeliveryClient } from '@kontent-ai/delivery-sdk';
import type { CollectionCodenames } from '../collections/_collections.js';
import type { LanguageCodenames } from '../languages/_languages.js';
import type { WorkflowCodenames, WorkflowStepCodenames } from '../workflows/_workflows.js';
import type { TaxonomyCodenames } from '../taxonomies/_taxonomies.js';
import type { TypeCodenames } from '../types/_types.js';
import type { ElementCodenames } from '../elements/_elements.js';

/*
 * Core content type with narrowed types. Use this instead of'IContentItem'
 */
export type CoreType<
	TElementCodenames extends string = string,
	TElements extends IContentItemElements<TElementCodenames> = IContentItemElements<TElementCodenames>,
	TContentTypeCodename extends TypeCodenames = TypeCodenames
> = IContentItem<TElements, TContentTypeCodename, LanguageCodenames, CollectionCodenames, WorkflowCodenames, WorkflowStepCodenames>;

/*
 * Core types for 'IDeliveryClient'
 */
export type CoreClientTypes = {
	readonly collectionCodenames: CollectionCodenames;
	readonly contentItemType: CoreType;
	readonly contentTypeCodenames: TypeCodenames;
	readonly elementCodenames: ElementCodenames;
	readonly languageCodenames: LanguageCodenames;
	readonly taxonomyCodenames: TaxonomyCodenames;
	readonly workflowCodenames: WorkflowCodenames;
	readonly workflowStepCodenames: WorkflowStepCodenames;
};

/*
 * Typed delivery client. Use this instead of 'IDeliveryClient'
 */
export type CoreDeliveryClient = IDeliveryClient<CoreClientTypes>;
