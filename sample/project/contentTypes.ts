/**
 * Generated by '@kontent-ai/model-generator@6.3.1'
 *
 * Project name: Import source  Movie DB test
 * Environment: Production
 * Environment Id: cdbf5823-cbec-010d-f4c3-0411eee31c0e
 */
export const contentTypes = {
    /**
     * Actor
     */
    actor: {
        codename: 'actor',
        id: '58099989-319f-495f-aa36-cb3710854e36',
        externalId: undefined,
        name: 'Actor',
        elements: {
            /**
             * First name (text)
             */
            first_name: {
                codename: 'first_name',
                id: '14dd70e5-c42d-f111-9640-c82b443edf1d',
                externalId: undefined,
                name: 'First name',
                required: false,
                type: 'text'
            },

            /**
             * Last name (text)
             */
            last_name: {
                codename: 'last_name',
                id: '9f7a0dd4-af3a-95ca-0358-400c14ce7075',
                externalId: undefined,
                name: 'Last name',
                required: false,
                type: 'text'
            },

            /**
             * Pages (subpages)
             */
            pages: {
                codename: 'pages',
                id: 'af3b152b-6c98-479e-937c-b68b562994b8',
                externalId: undefined,
                name: 'Pages',
                required: false,
                type: 'subpages'
            },

            /**
             * Photo (asset)
             */
            photo: {
                codename: 'photo',
                id: 'eaec9ba3-9624-6875-04ec-80d0b2e00781',
                externalId: undefined,
                name: 'Photo',
                required: false,
                type: 'asset'
            },

            /**
             * Url (url_slug)
             */
            url: {
                codename: 'url',
                id: 'c8658782-f209-a573-9c85-430fb4e3e9f0',
                externalId: undefined,
                name: 'Url',
                required: false,
                type: 'url_slug'
            }
        }
    },

    /**
     * Homepage
     */
    homepage: {
        codename: 'homepage',
        id: 'cc1bc18d-3e3e-4ee2-b871-f9903a794f9e',
        externalId: undefined,
        name: 'Homepage',
        elements: {
            /**
             * Content (modular_content)
             */
            content: {
                codename: 'content',
                id: 'e823aea0-6654-4d72-acfe-282d1bb52e9b',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'modular_content'
            },

            /**
             * Subpages (subpages)
             */
            subpages: {
                codename: 'subpages',
                id: 'a2bf46c9-4d56-4ca5-a86c-cc11ee035123',
                externalId: undefined,
                name: 'Subpages',
                required: false,
                type: 'subpages'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: 'dcc733f3-a67c-42ad-97df-5d50c0351b29',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Movie
     */
    movie: {
        codename: 'movie',
        id: 'b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c',
        externalId: undefined,
        name: 'Movie',
        elements: {
            /**
             * Category (multiple_choice)
             */
            category: {
                codename: 'category',
                id: '9821c252-6414-f549-c17f-cc171dd87713',
                externalId: undefined,
                name: 'Category',
                required: false,
                type: 'multiple_choice',
                options: {
                    sci_fi: {
                        name: 'Sci fi',
                        id: 'b087f774-1f57-9aa8-dab5-2ca88a646824',
                        codename: 'sci_fi',
                        externalId: undefined
                    },
                    documentary: {
                        name: 'Documentary',
                        id: '19c5e959-c24a-4863-0b4d-453cdef8fe9d',
                        codename: 'documentary',
                        externalId: undefined
                    },
                    action: {
                        name: 'Action',
                        id: '7d453309-8d74-9607-80c4-36dcc1bd005f',
                        codename: 'action',
                        externalId: undefined
                    },
                    romance: {
                        name: 'Romance',
                        id: '60550cc7-c986-a59f-b069-7565862fe1c1',
                        codename: 'romance',
                        externalId: undefined
                    },
                    animation: {
                        name: 'Animation',
                        id: '54c0590d-6a94-a69a-902d-fceea4fa62f8',
                        codename: 'animation',
                        externalId: undefined
                    },
                    comedy: {
                        name: 'Comedy',
                        id: 'd2fe357f-894e-9bc3-550c-c2c400d99c6b',
                        codename: 'comedy',
                        externalId: undefined
                    },
                    adventure: {
                        name: 'Adventure',
                        id: 'cd8389b0-7628-7739-7b14-3225a50212c1',
                        codename: 'adventure',
                        externalId: undefined
                    },
                    drama: {
                        name: 'Drama',
                        id: '051e74de-f2e0-f405-9ad5-5263221e46f2',
                        codename: 'drama',
                        externalId: undefined
                    }
                }
            },

            /**
             * Length (number)
             */
            length: {
                codename: 'length',
                id: '7e8ecfab-a419-27ee-d8ec-8adb76fd007c',
                externalId: undefined,
                name: 'Length',
                required: false,
                type: 'number'
            },

            /**
             * Plot (rich_text)
             */
            plot: {
                codename: 'plot',
                id: 'f7ee4f27-27fd-a19b-3c5c-102aae1c50ce',
                externalId: undefined,
                name: 'Plot',
                required: false,
                type: 'rich_text'
            },

            /**
             * Poster (asset)
             */
            poster: {
                codename: 'poster',
                id: 'a39a7237-9503-a1ae-8431-5b6cdb85ae9d',
                externalId: undefined,
                name: 'Poster',
                required: false,
                type: 'asset'
            },

            /**
             * ReleaseCategory (taxonomy)
             */
            releasecategory: {
                codename: 'releasecategory',
                id: '65f2fd44-1856-bc2b-17c2-decb0635e3d2',
                externalId: undefined,
                name: 'ReleaseCategory',
                required: false,
                type: 'taxonomy'
            },

            /**
             * Released (date_time)
             */
            released: {
                codename: 'released',
                id: '5ccf4644-0d65-5d96-9a32-f4ea21974d51',
                externalId: undefined,
                name: 'Released',
                required: false,
                type: 'date_time'
            },

            /**
             * SeoName (url_slug)
             */
            seoname: {
                codename: 'seoname',
                id: '756cc91a-a090-60f9-a7f0-f505bfbe046c',
                externalId: undefined,
                name: 'SeoName',
                required: false,
                type: 'url_slug'
            },

            /**
             * Stars (modular_content)
             */
            stars: {
                codename: 'stars',
                id: 'aa26a55d-19f8-7501-fea3-b0d9b1eeac71',
                externalId: undefined,
                name: 'Stars',
                required: false,
                type: 'modular_content'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: '3473187e-dc78-eff2-7099-f690f7042d4a',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Page
     */
    page: {
        codename: 'page',
        id: '2ef19f7d-5831-43f8-ad2f-892b3673316c',
        externalId: undefined,
        name: 'Page',
        elements: {
            /**
             * Content (modular_content)
             */
            content: {
                codename: 'content',
                id: 'f3e8106c-4d3f-4b8c-bbf6-e6830defef77',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'modular_content'
            },

            /**
             * Show in navigation (multiple_choice)
             */
            show_in_navigation: {
                codename: 'show_in_navigation',
                id: '7261cf38-c18a-4dcf-aa56-19f564b0a83f',
                externalId: undefined,
                name: 'Show in navigation',
                required: false,
                type: 'multiple_choice',
                options: {
                    yes: {
                        name: 'Yes',
                        id: 'a18a34ac-dfd5-4803-bded-f102680e2785',
                        codename: 'yes',
                        externalId: undefined
                    },
                    no: {
                        name: 'No',
                        id: 'e2a89add-ee20-40f3-bced-70dcc9190fef',
                        codename: 'no',
                        externalId: undefined
                    }
                }
            },

            /**
             * Subpages (subpages)
             */
            subpages: {
                codename: 'subpages',
                id: '0483231c-adfd-4ea4-bec9-88216070a81c',
                externalId: undefined,
                name: 'Subpages',
                required: false,
                type: 'subpages'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: '08b34d36-7587-4de5-ae07-b8e8466f418a',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            },

            /**
             * URL (url_slug)
             */
            url: {
                codename: 'url',
                id: 'a0938e88-8b8a-497b-852f-59fcd9bb1321',
                externalId: undefined,
                name: 'URL',
                required: false,
                type: 'url_slug'
            }
        }
    }
} as const;
