import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk';

/**
 *
 * Migration Toolkit   tests
 *
 * Environment: Production
 * Id: 5ddb8f47-a51f-0124-35b1-f6634fa91ae2
 */

/**
 * My snippet
 *
 * Id: 3274f9e7-ff1b-43f8-aa32-29b53939cd3e
 * Codename: my_snippet
 */
export type MySnippet = IContentItem<{
    /**
     * Snippet elem1 (text)
     *
     * Required: false
     * Codename: my_snippet__snippet_elem1
     * Id: 3b89ad47-4a72-4b4e-84b0-e8e8a7a3814d
     */
    mySnippetSnippetElem1: Elements.TextElement;

    /**
     * Snippet elem 2 (number)
     *
     * Required: false
     * Codename: my_snippet__snippet_elem_2
     * Id: b2f65646-3310-4a64-af2a-0d9d025a91d0
     */
    mySnippetSnippetElem2: Elements.NumberElement;
}>;
