import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { PageType } from "../types/page-type.generated.js";

/*
 * Type representing codename of 'Web spotlight root' type
 */
export type WebSpotlightRootTypeCodename = keyof Pick<Record<TypeCodenames, null>, "web_spotlight_root">;

/*
 * Typeguard for codename of 'Web spotlight root' type
 */
export function isWebSpotlightRootTypeCodename(value: string | undefined | null): value is WebSpotlightRootTypeCodename {
	return typeof value === "string" && value === ("web_spotlight_root" satisfies WebSpotlightRootTypeCodename);
}

/*
 * Elements of the 'Web spotlight root' content type
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export type WebSpotlightRootTypeElements = {
	/*
	 * Title
	 *
	 * Codename: title
	 * Id: e9d19fa4-4ad3-4b3f-998a-ca392651f7d0
	 * Type: text
	 * Required: false
	 */
	readonly title: Elements.Text;

	/*
	 * Subpages
	 *
	 * Codename: subpages
	 * Id: e6702a6b-35b8-4a12-acca-1b1361fc926b
	 * Type: subpages
	 * Required: false
	 * Allowed content types: page
	 */
	readonly subpages: Elements.LinkedItems<PageType>;

	/*
	 * Content
	 *
	 * Codename: content
	 * Id: ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8
	 * Type: modular_content
	 * Required: false
	 */
	readonly content: Elements.LinkedItems<CoreType>;
};

/*
 * Web spotlight root
 */
export type WebSpotlightRootType = ContentItemOf<CoreClientSchema, WebSpotlightRootTypeCodename, WebSpotlightRootTypeElements>;

/*
 * Type representing all available element codenames for Web spotlight root
 */
export type WebSpotlightRootTypeElementCodenames = "title" | "subpages" | "content";

/*
 * Type guard for Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export function isWebSpotlightRootType(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is WebSpotlightRootType {
	return isWebSpotlightRootTypeCodename(item?.system.type);
}
