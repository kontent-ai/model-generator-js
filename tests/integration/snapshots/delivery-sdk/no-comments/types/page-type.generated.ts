import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type PageTypeCodename = keyof Pick<Record<TypeCodenames, null>, "page">;

export function isPageTypeCodename(value: string | undefined | null): value is PageTypeCodename {
	return typeof value === "string" && value === ("page" satisfies PageTypeCodename);
}

export type PageType = IContentItem<
	{
		readonly title: Elements.TextElement;

		readonly url: Elements.UrlSlugElement;

		readonly show_in_navigation: Elements.MultipleChoiceElement<PageTypeShowInNavigationMultipleChoiceOptions>;

		readonly subpages: Elements.LinkedItemsElement<CoreType>;

		readonly content: Elements.LinkedItemsElement<CoreType>;
	},
	PageTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type PageTypeElementCodenames = "title" | "url" | "show_in_navigation" | "subpages" | "content";

export function isPageType(item: IContentItem | undefined | null): item is PageType {
	return item?.system.type === ("page" satisfies PageTypeCodename);
}

export type PageTypeShowInNavigationMultipleChoiceOptions = "yes" | "no";
