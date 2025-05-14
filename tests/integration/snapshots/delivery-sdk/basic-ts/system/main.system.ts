import type { IContentItem, IContentItemElements, IDeliveryClient } from '@kontent-ai/delivery-sdk';
import type { CollectionCodenames } from '../collections/_collections.ts';
import type { LanguageCodenames } from '../languages/_languages.ts';
import type { WorkflowCodenames, WorkflowStepCodenames } from '../workflows/_workflows.ts';
import type { TaxonomyCodenames } from '../taxonomies/_taxonomies.ts';
import type { TypeCodenames } from '../types/_types.ts';
import type { ElementCodenames } from '../elements/_elements.ts';

/*
 * Core content type used in favor of default 'IContentItem'
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
 * Typed delivery client in favor of default 'IDeliveryClient'
 */
export type CoreDeliveryClient = IDeliveryClient<CoreClientTypes>;
