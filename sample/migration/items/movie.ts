import { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import { Item } from '../migration-types.js';

export type MovieItem = Item<
    'movie',
    {
        title: MigrationElementModels.TextElement;
        plot: MigrationElementModels.RichTextElement;
        released: MigrationElementModels.DateTimeElement;
        length: MigrationElementModels.NumberElement;
        poster: MigrationElementModels.AssetElement;
        category: MigrationElementModels.MultipleChoiceElement;
        stars: MigrationElementModels.LinkedItemsElement;
        seoname: MigrationElementModels.UrlSlugElement;
        releasecategory: MigrationElementModels.TaxonomyElement;
    }
>;
