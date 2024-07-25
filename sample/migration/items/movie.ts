import { MigrationItem, MigrationElementModels } from '@kontent-ai/migration-toolkit';
import { System, WorkflowStepCodenames } from '../migration-types.js';

export type MovieItem = MigrationItem<
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
    },
    System<'movie'>,
    WorkflowStepCodenames
>;
