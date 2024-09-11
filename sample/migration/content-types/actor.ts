
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@7.4.0'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: Movie Database
* Environment: Production
* Id: da5abe9f-fdad-4168-97cd-b3464be2ccb9
* 
* -------------------------------------------------------------------------------
**/

import type { MigrationElementModels } from '@kontent-ai/migration-toolkit';
import type { Item } from '../migration.js';

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
         * Url
         *
         * Type: url_slug
         * Required: false
         * Codename: url
         * Id: c8658782-f209-a573-9c85-430fb4e3e9f0
         */
        readonly url: MigrationElementModels.UrlSlugElement;

        /**
         * First name
         *
         * Type: text
         * Required: true
         * Codename: first_name
         * Id: 14dd70e5-c42d-f111-9640-c82b443edf1d
         * Guidelines: This is the first name of the actor
         */
        readonly first_name: MigrationElementModels.TextElement;

        /**
         * Last name
         *
         * Type: text
         * Required: true
         * Codename: last_name
         * Id: 9f7a0dd4-af3a-95ca-0358-400c14ce7075
         */
        readonly last_name: MigrationElementModels.TextElement;

        /**
         * Photo
         *
         * Type: asset
         * Required: false
         * Codename: photo
         * Id: eaec9ba3-9624-6875-04ec-80d0b2e00781
         */
        readonly photo: MigrationElementModels.AssetElement;
    }
>;
