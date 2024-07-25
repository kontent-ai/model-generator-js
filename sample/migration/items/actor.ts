import { MigrationItem, MigrationElementModels } from '@kontent-ai/migration-toolkit';
import { System, WorkflowStepCodenames } from '../migration-types.js';

export type ActorItem = MigrationItem<
    {
        url: MigrationElementModels.UrlSlugElement;
        first_name: MigrationElementModels.TextElement;
        last_name: MigrationElementModels.TextElement;
        photo: MigrationElementModels.AssetElement;
    },
    System<'actor'>,
    WorkflowStepCodenames
>;
