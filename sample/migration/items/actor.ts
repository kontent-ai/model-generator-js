import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { Item } from '../core.models.js';

/**
 * Actor
 *
 * Codename: actor
 * Id: 58099989-319f-495f-aa36-cb3710854e36
 */
export type ActorItem = Item<
    'actor',
    {
        /**
         * Url (url_slug)
         *
         * Required: false
         * Codename: url
         * Id: c8658782-f209-a573-9c85-430fb4e3e9f0
         */
        url: MigrationElementModels.UrlSlugElement;

        /**
         * Firstname (text)
         *
         * Required: true
         * Codename: first_name
         * Id: 14dd70e5-c42d-f111-9640-c82b443edf1d
         * Guidelines: This is the first name of the actor
         */
        first_name: MigrationElementModels.TextElement;

        /**
         * Lastname (text)
         *
         * Required: true
         * Codename: last_name
         * Id: 9f7a0dd4-af3a-95ca-0358-400c14ce7075
         */
        last_name: MigrationElementModels.TextElement;

        /**
         * Photo (asset)
         *
         * Required: false
         * Codename: photo
         * Id: eaec9ba3-9624-6875-04ec-80d0b2e00781
         */
        photo: MigrationElementModels.AssetElement;
    }
>;
