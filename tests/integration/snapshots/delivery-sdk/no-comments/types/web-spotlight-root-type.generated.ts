import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreItem, TypeCodenames } from "../system/types.generated.js";
import type { PageItem } from "../types/page-type.generated.js";

export type WebSpotlightRootCodename = keyof Pick<Record<TypeCodenames, null>, "web_spotlight_root">;

export function isWebSpotlightRootCodename(value: string | undefined | null): value is WebSpotlightRootCodename {
	return typeof value === "string" && value === ("web_spotlight_root" satisfies WebSpotlightRootCodename);
}

export type WebSpotlightRootItem = ContentItemOf<
	CoreClientSchema,
	WebSpotlightRootCodename,
	{
		readonly title: Elements.Text;

		readonly subpages: Elements.LinkedItems<PageItem>;

		readonly content: Elements.LinkedItems<CoreItem>;
	}
>;

export type WebSpotlightRootElementCodenames = "title" | "subpages" | "content";

export function isWebSpotlightRootItem(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is WebSpotlightRootItem {
	return isWebSpotlightRootCodename(item?.system.type);
}
