
import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "./collections.generated.js";
import type { ElementCodenames } from "./elements.generated.js";
import type { LanguageCodenames } from "./languages.generated.js";
import type { TaxonomyCodenames } from "./taxonomies.generated.js";
import type { CoreType, TypeCodenames } from "./types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "./workflows.generated.js";

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

export type CoreDeliveryClient = IDeliveryClient<CoreClientTypes>;
