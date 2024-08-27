import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk';
import type { MySnippet } from '../content-type-snippets/my_snippet.js';

/**
 *
 * Migration Toolkit - tests
 *
 * Environment: Production
 * Id: 5ddb8f47-a51f-0124-35b1-f6634fa91ae2
 */

/**
 * Test
 *
 * Id: 81ab0b2c-dd14-41e7-a1ed-868b249ad8bc
 * Codename: test
 */
export type Test = IContentItem<{
    /**
     * Text (text)
     * Required: false
     * Id: 65f61f6a-b69c-47dc-bc38-19855507bf14
     * Codename: text
     */
    text: Elements.TextElement;
}> &
    MySnippet;
