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
         * Id: c8658782-f209-a573-9c85-430fb4e3e9f0
         * Codename: url
         */
        url: MigrationElementModels.UrlSlugElement;

        /**
         * Firstname (text)
         *
         * Required: true
         * Id: 14dd70e5-c42d-f111-9640-c82b443edf1d
         * Codename: first_name
         * Guidelines: This is the first name of the actor
         */
        first_name: MigrationElementModels.TextElement;

        /**
         * Lastname (text)
         *
         * Required: true
         * Id: 9f7a0dd4-af3a-95ca-0358-400c14ce7075
         * Codename: last_name
         */
        last_name: MigrationElementModels.TextElement;

        /**
         * Photo (asset)
         *
         * Required: false
         * Id: eaec9ba3-9624-6875-04ec-80d0b2e00781
         * Codename: photo
         */
        photo: MigrationElementModels.AssetElement;
    }
>;
