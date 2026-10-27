import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreItem, TypeCodenames } from "../system/types.generated.js";

export type PageCodename = keyof Pick<Record<TypeCodenames, null>, "page">;

export function isPageCodename(value: string | undefined | null): value is PageCodename {
	return typeof value === "string" && value === ("page" satisfies PageCodename);
}

export type PageItem = ContentItemOf<
	CoreClientSchema,
	PageCodename,
	{
		readonly title: Elements.Text;

		readonly url: Elements.UrlSlug;

		readonly show_in_navigation: Elements.MultipleChoice<PageShowInNavigationMultipleChoiceOptions>;

		readonly subpages: Elements.LinkedItems<CoreItem>;

		readonly content: Elements.LinkedItems<CoreItem>;
	}
>;

export type PageElementCodenames = "title" | "url" | "show_in_navigation" | "subpages" | "content";

export function isPageItem(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is PageItem {
	return isPageCodename(item?.system.type);
}

export type PageShowInNavigationMultipleChoiceOptions = "yes" | "no";
