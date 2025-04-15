import type { Elements } from '@kontent-ai/delivery-sdk';
import type { ContentType_page } from './index.js';
import type { CoreItem } from '../system/index.js';

/**
 * Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export type ContentType_web_spotlight_root = CoreItem<
    ContentType_web_spotlight_rootElementCodenames,
    {
        /**
         * Title
         *
         * Type: text
         * Required: false
         * Codename: title
         * Id: e9d19fa4-4ad3-4b3f-998a-ca392651f7d0
         */
        readonly title: Elements.TextElement;
        /**
         * Subpages
         *
         * Type: subpages
         * Required: false
         * Codename: subpages
         * Id: e6702a6b-35b8-4a12-acca-1b1361fc926b
         */
        readonly subpages: Elements.LinkedItemsElement<ContentType_page>;
        /**
         * Content
         *
         * Type: modular_content
         * Required: false
         * Codename: content
         * Id: ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8
         */
        readonly content: Elements.LinkedItemsElement<CoreItem>;
    },
    'web_spotlight_root'
>;

/**
 * Type representing all available element codenames for Web spotlight root
 */
export type ContentType_web_spotlight_rootElementCodenames = 'title' | 'subpages' | 'content';

/**
 * Type guard for Web spotlight root
 *
 * Id: 7e8ca9f3-7f06-44d6-b9db-ae4905531365
 * Codename: web_spotlight_root
 */
export function isContentType_web_spotlight_rootItem(item: CoreItem | undefined | null): item is ContentType_web_spotlight_root {
    return item?.system?.type === 'web_spotlight_root';
}
