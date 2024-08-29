import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk';

/**
 *
 * Migration Toolkit   tests
 *
 * Environment: Production
 * Id: 5ddb8f47-a51f-0124-35b1-f6634fa91ae2
 */

/**
 * Actor
 *
 * Id: d8900ee2-82f4-4189-a994-4e121582aadf
 * Codename: actor
 */
export type Actor = IContentItem<{
    /**
     * photo (asset)
     *
     * Required: false
     * Codename: photo
     * Id: 069b38ee-385c-410f-b7fe-53ec59a5f139
     */
    photo: Elements.AssetsElement;

    /**
     * url (url_slug)
     *
     * Required: false
     * Codename: url
     * Id: c4b2d64f-af45-45a4-92d8-4829833563ff
     */
    url: Elements.UrlSlugElement;

    /**
     * last_name (text)
     *
     * Required: false
     * Codename: last_name
     * Id: 0f00b26e-60f3-462d-8110-18180137c3a0
     */
    lastName: Elements.TextElement;

    /**
     * first_name (text)
     *
     * Required: false
     * Codename: first_name
     * Id: 4af5e7ce-88ef-4159-96ae-96a552992f91
     */
    firstName: Elements.TextElement;
}>;
