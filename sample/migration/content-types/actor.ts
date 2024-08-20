import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { Item } from '../core.models.js';

/**
 * Actor
 *
 * Codename: actor
 * Id: d8900ee2-82f4-4189-a994-4e121582aadf
 */
export type ActorItem = Item<
    'actor',
    {
        /**
         * photo (asset)
         *
         * Required: false
         * Codename: photo
         * Id: 069b38ee-385c-410f-b7fe-53ec59a5f139
         */
        photo: MigrationElementModels.AssetElement;

        /**
         * url (url_slug)
         *
         * Required: false
         * Codename: url
         * Id: c4b2d64f-af45-45a4-92d8-4829833563ff
         */
        url: MigrationElementModels.UrlSlugElement;

        /**
         * last_name (text)
         *
         * Required: false
         * Codename: last_name
         * Id: 0f00b26e-60f3-462d-8110-18180137c3a0
         */
        last_name: MigrationElementModels.TextElement;

        /**
         * first_name (text)
         *
         * Required: false
         * Codename: first_name
         * Id: 4af5e7ce-88ef-4159-96ae-96a552992f91
         */
        first_name: MigrationElementModels.TextElement;
    }
>;
