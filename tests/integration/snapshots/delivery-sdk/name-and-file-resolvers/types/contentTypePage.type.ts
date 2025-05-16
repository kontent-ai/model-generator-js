import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: Page
 * Codename: page
 * Type: Type
 */
export type ContentTypePageTypeCodename = Extract<TypeCodenames, 'page'>;

/*
 * Typeguard function for entity
 *
 * Name: Page
 * Codename: page
 * Type: Type
 */
export function isContentTypePageTypeCodename(value: string | undefined | null): value is ContentTypePageTypeCodename {
	return typeof value === 'string' && value === ('page' satisfies ContentTypePageTypeCodename);
}

/*
 * Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export type ContentTypePageType = CoreType<
	ContentTypePageTypeElementCodenames,
	{
		/*
		 * Title
		 *
		 * Type: text
		 * Required: false
		 * Codename: title
		 * Id: e9ad8c8f-6fb0-41d2-8caa-4e4e0ba24719
		 */
		readonly title: Elements.TextElement;
		/*
		 * URL
		 *
		 * Type: url_slug
		 * Required: false
		 * Codename: url
		 * Id: e573bfc9-3193-4224-9d2a-9efb83da8849
		 */
		readonly url: Elements.UrlSlugElement;
		/*
		 * Show in navigation
		 *
		 * Type: multiple_choice
		 * Required: false
		 * Codename: show_in_navigation
		 * Id: 07889917-fdc5-4285-bc30-4fed2a218c89
		 */
		readonly show_in_navigation: Elements.MultipleChoiceElement<ContentTypePageTypeShowInNavigationMultipleChoiceOptions>;
		/*
		 * Subpages
		 *
		 * Type: subpages
		 * Required: false
		 * Codename: subpages
		 * Id: b909dc5d-0efe-478a-9257-83e5c90e884d
		 */
		readonly subpages: Elements.LinkedItemsElement<CoreType>;
		/*
		 * Content
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: content
		 * Id: dfb0d07c-531e-4eaa-8f7d-e62671d4ca36
		 */
		readonly content: Elements.LinkedItemsElement<CoreType>;
	},
	ContentTypePageTypeCodename
>;

/*
 * Type representing all available element codenames for Page
 */
export type ContentTypePageTypeElementCodenames = 'title' | 'url' | 'show_in_navigation' | 'subpages' | 'content';

/*
 * Type guard for Page
 *
 * Id: 4db6e2c7-c25b-4896-a05d-d20206234c04
 * Codename: page
 */
export function isContentTypePage(item: CoreType | undefined | null): item is ContentTypePageType {
	return item?.system?.type === ('page' satisfies ContentTypePageTypeCodename);
}

export type ContentTypePageTypeShowInNavigationMultipleChoiceOptions = 'yes' | 'no';
