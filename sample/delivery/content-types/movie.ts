import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk';
import type { Category } from '../taxonomies/category.js';
import type { ReleaseCategory } from '../taxonomies/release_category.js';
import type { TaxonomySnippetTest } from '../content-type-snippets/taxonomy_snippet_test.js';

/**
 *
 * Migration Toolkit - tests
 *
 * Environment: Production
 * Id: 5ddb8f47-a51f-0124-35b1-f6634fa91ae2
 */

/**
 * Movie
 *
 * Id: db7356f6-1d82-42a0-9ebb-07865cffa995
 * Codename: movie
 */
export type Movie = IContentItem<{
    /**
     * Release category (taxonomy)
     * Required: false
     * Id: 5faa827f-f262-43c3-8f58-0f354b8d393f
     * Codename: releasecategory
     */
    releasecategory: Elements.TaxonomyElement<ReleaseCategory>;

    /**
     * Category (taxonomy)
     * Required: false
     * Id: 8c12be35-e3e7-447c-a185-7b5e101ebf12
     * Codename: category
     */
    category: Elements.TaxonomyElement<Category>;

    /**
     * length (number)
     * Required: false
     * Id: e3d07f3a-60c2-4072-846d-c23e51ec833e
     * Codename: length
     */
    length: Elements.NumberElement;

    /**
     * stars (modular_content)
     * Required: false
     * Id: 55596dd1-e808-415d-95aa-e2be34238d11
     * Codename: stars
     */
    stars: Elements.LinkedItemsElement<IContentItem>;

    /**
     * seoname (url_slug)
     * Required: false
     * Id: 734f94be-5930-4bdf-b05b-f59f5a291675
     * Codename: seoname
     */
    seoname: Elements.UrlSlugElement;

    /**
     * poster (asset)
     * Required: false
     * Id: 9b197f1e-0728-4d14-9814-97f7b8ef01fc
     * Codename: poster
     */
    poster: Elements.AssetsElement;

    /**
     * released (date_time)
     * Required: false
     * Id: 656b9dc9-7bba-4f1f-a2b8-52f7f730a66f
     * Codename: released
     */
    released: Elements.DateTimeElement;

    /**
     * plot (rich_text)
     * Required: false
     * Id: ad2e5dc7-8d08-4f74-afeb-25b475f1e6fc
     * Codename: plot
     */
    plot: Elements.RichTextElement;

    /**
     * title (text)
     * Required: false
     * Id: 660c851a-a9a1-4378-97a3-1348bc2a4d76
     * Codename: title
     */
    title: Elements.TextElement;
}> &
    TaxonomySnippetTest;
