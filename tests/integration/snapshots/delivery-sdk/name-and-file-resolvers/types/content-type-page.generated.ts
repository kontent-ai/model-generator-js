import type { ContentItemOf, ContentItemPayload, Elements } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";

/*
 * Type representing codename of 'Page' type
 */
export type ContentTypePageCodename = keyof Pick<Record<TypeCodenames, null>, "page">;

/*
 * Typeguard for codename of 'Page' type
 */
export function isContentTypePageCodename(value: string | undefined | null): value is ContentTypePageCodename {
	return typeof value === "string" && value === ("page" satisfies ContentTypePageCodename);
}

/*
 * Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export type ContentTypePage = ContentItemOf<
	CoreClientSchema,
	ContentTypePageCodename,
	{
		/*
		 * Title
		 *
		 * Codename: title
		 * Id: e9ad8c8f-6fb0-41d2-8caa-4e4e0ba24719
		 * Type: text
		 * Required: false
		 */
		readonly title: Elements.Text;

		/*
		 * URL
		 *
		 * Codename: url
		 * Id: e573bfc9-3193-4224-9d2a-9efb83da8849
		 * Type: url_slug
		 * Required: false
		 */
		readonly url: Elements.UrlSlug;

		/*
		 * Show in navigation
		 *
		 * Codename: show_in_navigation
		 * Id: 07889917-fdc5-4285-bc30-4fed2a218c89
		 * Type: multiple_choice
		 * Required: false
		 */
		readonly show_in_navigation: Elements.MultipleChoice<ContentTypePageShowInNavigationMultipleChoiceOptions>;

		/*
		 * Subpages
		 *
		 * Codename: subpages
		 * Id: b909dc5d-0efe-478a-9257-83e5c90e884d
		 * Type: subpages
		 * Required: false
		 */
		readonly subpages: Elements.LinkedItems<CoreType>;

		/*
		 * Content
		 *
		 * Codename: content
		 * Id: dfb0d07c-531e-4eaa-8f7d-e62671d4ca36
		 * Type: modular_content
		 * Required: false
		 */
		readonly content: Elements.LinkedItems<CoreType>;
	}
>;

/*
 * Type representing all available element codenames for Page
 */
export type ContentTypePageElementCodenames = "title" | "url" | "show_in_navigation" | "subpages" | "content";

/*
 * Type guard for Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export function isContentTypePage(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is ContentTypePage {
	return isContentTypePageCodename(item?.system.type);
}

export type ContentTypePageShowInNavigationMultipleChoiceOptions = "yes" | "no";
