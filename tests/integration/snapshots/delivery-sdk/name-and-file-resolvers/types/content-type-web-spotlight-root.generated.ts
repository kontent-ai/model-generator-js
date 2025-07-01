import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk"
import type { CollectionCodenames } from "../system/collections.generated.js"
import type { LanguageCodenames } from "../system/languages.generated.js"
import type { CoreType, TypeCodenames } from "../system/types.generated.js"
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js"
import type { ContentTypePage } from "../types/content-type-page.generated.js"

/*
 * Type representing codename of 'Web spotlight root' type
 */
export type ContentTypeWebSpotlightRootCodename = keyof Pick<Record<TypeCodenames, null>, "web_spotlight_root">

/*
 * Typeguard for codename of 'Web spotlight root' type
 */
export function isContentTypeWebSpotlightRootCodename(value: string | undefined | null): value is ContentTypeWebSpotlightRootCodename {
	return typeof value === "string" && value === ("web_spotlight_root" satisfies ContentTypeWebSpotlightRootCodename)
}

/*
 * Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export type ContentTypeWebSpotlightRoot = IContentItem<
	{
		/*
		 * Title
		 *
		 * Codename: title
		 * Id: e9d19fa4-4ad3-4b3f-998a-ca392651f7d0
		 * Type: text
		 * Required: false
		 */
		readonly title: Elements.TextElement

		/*
		 * Subpages
		 *
		 * Codename: subpages
		 * Id: e6702a6b-35b8-4a12-acca-1b1361fc926b
		 * Type: subpages
		 * Required: false
		 * Allowed content types: page
		 */
		readonly subpages: Elements.LinkedItemsElement<ContentTypePage>

		/*
		 * Content
		 *
		 * Codename: content
		 * Id: ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8
		 * Type: modular_content
		 * Required: false
		 */
		readonly content: Elements.LinkedItemsElement<CoreType>
	},
	ContentTypeWebSpotlightRootCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>

/*
 * Type representing all available element codenames for Web spotlight root
 */
export type ContentTypeWebSpotlightRootElementCodenames = "title" | "subpages" | "content"

/*
 * Type guard for Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export function isContentTypeWebSpotlightRoot(item: IContentItem | undefined | null): item is ContentTypeWebSpotlightRoot {
	return item?.system.type === ("web_spotlight_root" satisfies ContentTypeWebSpotlightRootCodename)
}
