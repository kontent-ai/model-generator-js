import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";

export type PageTypeCodename = keyof Pick<Record<TypeCodenames, null>, "page">;

export function isPageTypeCodename(value: string | undefined | null): value is PageTypeCodename {
	return typeof value === "string" && value === ("page" satisfies PageTypeCodename);
}

export type PageTypeElements = {
	readonly title: Elements.Text;

	readonly url: Elements.UrlSlug;

	readonly show_in_navigation: Elements.MultipleChoice<PageTypeShowInNavigationMultipleChoiceOptions>;

	readonly subpages: Elements.LinkedItems<CoreType>;

	readonly content: Elements.LinkedItems<CoreType>;
};

export type PageType = ContentItemOf<CoreClientSchema, PageTypeCodename, PageTypeElements>;

export type PageTypeElementCodenames = "title" | "url" | "show_in_navigation" | "subpages" | "content";

export function isPageType(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is PageType {
	return isPageTypeCodename(item?.system.type);
}

export type PageTypeShowInNavigationMultipleChoiceOptions = "yes" | "no";
