import { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import { Item } from '../migration-types.js';

export type ActorItem = Item<
    'actor',
    {
        url: MigrationElementModels.UrlSlugElement;
        first_name: MigrationElementModels.TextElement;
        last_name: MigrationElementModels.TextElement;
        photo: MigrationElementModels.AssetElement;
    }
>;
