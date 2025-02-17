
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.0.0-16'.
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

export const contentTypes = {
    /**
     * Actor
     */
    actor: {
        name: 'Actor',
        codename: 'actor',
        id: '58099989-319f-495f-aa36-cb3710854e36',
        externalId: undefined,
        elements: {
            /**
             * Url (url_slug)
             */
            url: {
                name: 'Url',
                codename: 'url',
                id: 'c8658782-f209-a573-9c85-430fb4e3e9f0',
                externalId: undefined,
                required: false,
                type: 'url_slug'
            },

            /**
             * First name (text)
             * Guidelines: This is the first name of the actor
             */
            first_name: {
                name: 'First name',
                codename: 'first_name',
                id: '14dd70e5-c42d-f111-9640-c82b443edf1d',
                externalId: undefined,
                required: true,
                type: 'text'
            },

            /**
             * Last name (text)
             */
            last_name: {
                name: 'Last name',
                codename: 'last_name',
                id: '9f7a0dd4-af3a-95ca-0358-400c14ce7075',
                externalId: undefined,
                required: true,
                type: 'text'
            },

            /**
             * Photo (asset)
             */
            photo: {
                name: 'Photo',
                codename: 'photo',
                id: 'eaec9ba3-9624-6875-04ec-80d0b2e00781',
                externalId: undefined,
                required: false,
                type: 'asset'
            }
        }
    },

    /**
     * Movie
     */
    movie: {
        name: 'Movie',
        codename: 'movie',
        id: 'b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c',
        externalId: undefined,
        elements: {
            /**
             * Title (text)
             */
            title: {
                name: 'Title',
                codename: 'title',
                id: '3473187e-dc78-eff2-7099-f690f7042d4a',
                externalId: undefined,
                required: true,
                type: 'text'
            },

            /**
             * Plot (rich_text)
             */
            plot: {
                name: 'Plot',
                codename: 'plot',
                id: 'f7ee4f27-27fd-a19b-3c5c-102aae1c50ce',
                externalId: undefined,
                required: false,
                type: 'rich_text'
            },

            /**
             * Released (date_time)
             */
            released: {
                name: 'Released',
                codename: 'released',
                id: '5ccf4644-0d65-5d96-9a32-f4ea21974d51',
                externalId: undefined,
                required: false,
                type: 'date_time'
            },

            /**
             * Length (number)
             */
            length: {
                name: 'Length',
                codename: 'length',
                id: '7e8ecfab-a419-27ee-d8ec-8adb76fd007c',
                externalId: undefined,
                required: false,
                type: 'number'
            },

            /**
             * Poster (asset)
             */
            poster: {
                name: 'Poster',
                codename: 'poster',
                id: 'a39a7237-9503-a1ae-8431-5b6cdb85ae9d',
                externalId: undefined,
                required: false,
                type: 'asset'
            },

            /**
             * Category (multiple_choice)
             */
            category: {
                name: 'Category',
                codename: 'category',
                id: '9821c252-6414-f549-c17f-cc171dd87713',
                externalId: undefined,
                required: false,
                type: 'multiple_choice',
                options: {
                    /**
                     * Sci-fi
                     */
                    sci_fi: {
                        name: 'Sci-fi',
                        id: 'b087f774-1f57-9aa8-dab5-2ca88a646824',
                        codename: 'sci_fi',
                        externalId: undefined
                    },

                    /**
                     * Documentary
                     */
                    documentary: {
                        name: 'Documentary',
                        id: '19c5e959-c24a-4863-0b4d-453cdef8fe9d',
                        codename: 'documentary',
                        externalId: undefined
                    },

                    /**
                     * Action
                     */
                    action: {
                        name: 'Action',
                        id: '7d453309-8d74-9607-80c4-36dcc1bd005f',
                        codename: 'action',
                        externalId: undefined
                    },

                    /**
                     * Romance
                     */
                    romance: {
                        name: 'Romance',
                        id: '60550cc7-c986-a59f-b069-7565862fe1c1',
                        codename: 'romance',
                        externalId: undefined
                    },

                    /**
                     * Animation
                     */
                    animation: {
                        name: 'Animation',
                        id: '54c0590d-6a94-a69a-902d-fceea4fa62f8',
                        codename: 'animation',
                        externalId: undefined
                    },

                    /**
                     * Comedy
                     */
                    comedy: {
                        name: 'Comedy',
                        id: 'd2fe357f-894e-9bc3-550c-c2c400d99c6b',
                        codename: 'comedy',
                        externalId: undefined
                    },

                    /**
                     * Adventure
                     */
                    adventure: {
                        name: 'Adventure',
                        id: 'cd8389b0-7628-7739-7b14-3225a50212c1',
                        codename: 'adventure',
                        externalId: undefined
                    },

                    /**
                     * Drama
                     */
                    drama: {
                        name: 'Drama',
                        id: '051e74de-f2e0-f405-9ad5-5263221e46f2',
                        codename: 'drama',
                        externalId: undefined
                    }
                }
            },

            /**
             * Stars (modular_content)
             */
            stars: {
                name: 'Stars',
                codename: 'stars',
                id: 'aa26a55d-19f8-7501-fea3-b0d9b1eeac71',
                externalId: undefined,
                required: false,
                type: 'modular_content'
            },

            /**
             * SeoName (url_slug)
             */
            seoname: {
                name: 'SeoName',
                codename: 'seoname',
                id: '756cc91a-a090-60f9-a7f0-f505bfbe046c',
                externalId: undefined,
                required: false,
                type: 'url_slug'
            },

            /**
             * ReleaseCategory (taxonomy)
             */
            releasecategory: {
                name: 'ReleaseCategory',
                codename: 'releasecategory',
                id: '65f2fd44-1856-bc2b-17c2-decb0635e3d2',
                externalId: undefined,
                required: false,
                type: 'taxonomy'
            }
        }
    }
} as const;
