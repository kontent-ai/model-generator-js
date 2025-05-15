import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { ContentTypePageType } from './index.js';
import type { CoreType } from '../system/index.js';

/*
 * Type representing codename of entity
 *
 * Name: Web spotlight root
 * Codename: web_spotlight_root
 * Type: Type
 */
export type WebSpotlightRootTypeCodename = Extract<TypeCodenames, 'web_spotlight_root'>;

/*
 * Type guard for Web spotlight root
 *
 * Name: Web spotlight root
 * Codename: web_spotlight_root
 * Type: Type
 */
export function isWebSpotlightRootTypeCodename(value: string | undefined | null): value is WebSpotlightRootTypeCodename {
	return typeof value === 'string' && value === ('web_spotlight_root' satisfies WebSpotlightRootTypeCodename);
}

/*
 * Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export type ContentTypeWebSpotlightRootType = CoreType<
	ContentTypeWebSpotlightRootTypeElementCodenames,
	{
		/*
		 * Title
		 *
		 * Type: text
		 * Required: false
		 * Codename: title
		 * Id: e9d19fa4-4ad3-4b3f-998a-ca392651f7d0
		 */
		readonly title: Elements.TextElement;
		/*
		 * Subpages
		 *
		 * Type: subpages
		 * Required: false
		 * Codename: subpages
		 * Id: e6702a6b-35b8-4a12-acca-1b1361fc926b
		 */
		readonly subpages: Elements.LinkedItemsElement<ContentTypePageType>;
		/*
		 * Content
		 *
		 * Type: modular_content
		 * Required: false
		 * Codename: content
		 * Id: ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8
		 */
		readonly content: Elements.LinkedItemsElement<CoreType>;
	},
	ContentTypeWebSpotlightRootTypeCodename
>;

/*
 * Type representing all available element codenames for Web spotlight root
 */
export type ContentTypeWebSpotlightRootTypeElementCodenames = 'title' | 'subpages' | 'content';

/*
 * Type guard for Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export function isContentTypeWebSpotlightRootType(item: CoreType | undefined | null): item is ContentTypeWebSpotlightRootType {
	return item?.system?.type === ('web_spotlight_root' satisfies ContentTypeWebSpotlightRootTypeCodename);
}
