import type { TypeCodenames } from "./_types.js"
import type { Elements } from "@kontent-ai/delivery-sdk"
import type { CoreType } from "../system/index.js"

/*
 * Type representing codename of 'Page' type
 */
export type PageTypeCodename = Extract<TypeCodenames, "page">

/*
 * Typeguard for codename of 'Page' type
 */
export function isPageTypeCodename(value: string | undefined | null): value is PageTypeCodename {
	return typeof value === "string" && value === ("page" satisfies PageTypeCodename)
}

/*
 * Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export type PageType = CoreType<
	PageTypeElementCodenames,
	{
		/*
		 * Title
		 *
		 * Codename: title
		 * Id: e9ad8c8f-6fb0-41d2-8caa-4e4e0ba24719
		 * Type: text
		 * Required: false
		 */
		readonly title: Elements.TextElement

		/*
		 * URL
		 *
		 * Codename: url
		 * Id: e573bfc9-3193-4224-9d2a-9efb83da8849
		 * Type: url_slug
		 * Required: false
		 */
		readonly url: Elements.UrlSlugElement

		/*
		 * Show in navigation
		 *
		 * Codename: show_in_navigation
		 * Id: 07889917-fdc5-4285-bc30-4fed2a218c89
		 * Type: multiple_choice
		 * Required: false
		 */
		readonly show_in_navigation: Elements.MultipleChoiceElement<PageTypeShowInNavigationMultipleChoiceOptions>

		/*
		 * Subpages
		 *
		 * Codename: subpages
		 * Id: b909dc5d-0efe-478a-9257-83e5c90e884d
		 * Type: subpages
		 * Required: false
		 */
		readonly subpages: Elements.LinkedItemsElement<CoreType>

		/*
		 * Content
		 *
		 * Codename: content
		 * Id: dfb0d07c-531e-4eaa-8f7d-e62671d4ca36
		 * Type: modular_content
		 * Required: false
		 */
		readonly content: Elements.LinkedItemsElement<CoreType>
	},
	PageTypeCodename
>

/*
 * Type representing all available element codenames for Page
 */
export type PageTypeElementCodenames = "title" | "url" | "show_in_navigation" | "subpages" | "content"

/*
 * Type guard for Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export function isPageType(item: CoreType | undefined | null): item is PageType {
	return item?.system.type === ("page" satisfies PageTypeCodename)
}

export type PageTypeShowInNavigationMultipleChoiceOptions = "yes" | "no"
