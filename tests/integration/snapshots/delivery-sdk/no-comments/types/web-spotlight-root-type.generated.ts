import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";
import type { PageType } from "../types/page-type.generated.js";

export type WebSpotlightRootTypeCodename = keyof Pick<Record<TypeCodenames, null>, "web_spotlight_root">;

export function isWebSpotlightRootTypeCodename(value: string | undefined | null): value is WebSpotlightRootTypeCodename {
	return typeof value === "string" && value === ("web_spotlight_root" satisfies WebSpotlightRootTypeCodename);
}

export type WebSpotlightRootType = IContentItem<
	{
		readonly title: Elements.TextElement;

		readonly subpages: Elements.LinkedItemsElement<PageType>;

		readonly content: Elements.LinkedItemsElement<CoreType>;
	},
	WebSpotlightRootTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type WebSpotlightRootTypeElementCodenames = "title" | "subpages" | "content";

export function isWebSpotlightRootType(item: IContentItem | undefined | null): item is WebSpotlightRootType {
	return item?.system.type === ("web_spotlight_root" satisfies WebSpotlightRootTypeCodename);
}
