import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { PageType } from "../types/page-type.generated.js";

export type WebSpotlightRootTypeCodename = keyof Pick<Record<TypeCodenames, null>, "web_spotlight_root">;

export function isWebSpotlightRootTypeCodename(value: string | undefined | null): value is WebSpotlightRootTypeCodename {
	return typeof value === "string" && value === ("web_spotlight_root" satisfies WebSpotlightRootTypeCodename);
}

export type WebSpotlightRootType = ContentItemOf<
	CoreClientSchema,
	WebSpotlightRootTypeCodename,
	{
		readonly title: Elements.Text;

		readonly subpages: Elements.LinkedItems<PageType>;

		readonly content: Elements.LinkedItems<CoreType>;
	}
>;

export type WebSpotlightRootTypeElementCodenames = "title" | "subpages" | "content";

export function isWebSpotlightRootType(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is WebSpotlightRootType {
	return isWebSpotlightRootTypeCodename(item?.system.type);
}
