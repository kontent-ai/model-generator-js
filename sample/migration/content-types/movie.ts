import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { Item } from '../core.models.js';

/**
 * Movie
 *
 * Codename: movie
 * Id: db7356f6-1d82-42a0-9ebb-07865cffa995
 */
export type MovieItem = Item<
    'movie',
    {
        /**
         * Category (taxonomy)
         *
         * Required: false
         * Codename: taxonomy_snippet_test__test_taxonomy
         * Id: c030e3ec-5031-4d7f-af88-5032365733c7
         */
        taxonomy_snippet_test__test_taxonomy: MigrationElementModels.TaxonomyElement;

        /**
         * Release category (taxonomy)
         *
         * Required: false
         * Codename: releasecategory
         * Id: 5faa827f-f262-43c3-8f58-0f354b8d393f
         */
        releasecategory: MigrationElementModels.TaxonomyElement;

        /**
         * Category (taxonomy)
         *
         * Required: false
         * Codename: category
         * Id: 8c12be35-e3e7-447c-a185-7b5e101ebf12
         */
        category: MigrationElementModels.TaxonomyElement;

        /**
         * length (number)
         *
         * Required: false
         * Codename: length
         * Id: e3d07f3a-60c2-4072-846d-c23e51ec833e
         */
        length: MigrationElementModels.NumberElement;

        /**
         * stars (modular_content)
         *
         * Required: false
         * Codename: stars
         * Id: 55596dd1-e808-415d-95aa-e2be34238d11
         */
        stars: MigrationElementModels.LinkedItemsElement;

        /**
         * seoname (url_slug)
         *
         * Required: false
         * Codename: seoname
         * Id: 734f94be-5930-4bdf-b05b-f59f5a291675
         */
        seoname: MigrationElementModels.UrlSlugElement;

        /**
         * poster (asset)
         *
         * Required: false
         * Codename: poster
         * Id: 9b197f1e-0728-4d14-9814-97f7b8ef01fc
         */
        poster: MigrationElementModels.AssetElement;

        /**
         * released (date_time)
         *
         * Required: false
         * Codename: released
         * Id: 656b9dc9-7bba-4f1f-a2b8-52f7f730a66f
         */
        released: MigrationElementModels.DateTimeElement;

        /**
         * plot (rich_text)
         *
         * Required: false
         * Codename: plot
         * Id: ad2e5dc7-8d08-4f74-afeb-25b475f1e6fc
         */
        plot: MigrationElementModels.RichTextElement;

        /**
         * title (text)
         *
         * Required: false
         * Codename: title
         * Id: 660c851a-a9a1-4378-97a3-1348bc2a4d76
         */
        title: MigrationElementModels.TextElement;
    }
>;