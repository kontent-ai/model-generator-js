export const taxonomies = {
    /**
     * movietype
     */
    movietype: {
        name: 'MovieType',
        codename: 'movietype',
        externalId: undefined,
        id: '365a17e6-1929-27ab-9f67-a9273c846717',
        terms: {
            /**
             * Student
             */
            student: {
                name: 'Student',
                codename: 'student',
                id: 'b107e12c-124d-705f-1029-c0dfdd0b2438',
                externalId: undefined,
                terms: {}
            },

            /**
             * Film
             */
            film: {
                name: 'Film',
                codename: 'film',
                id: '5a2a1927-41a4-294f-5d89-cf0cc045e943',
                externalId: undefined,
                terms: {
                    /**
                     * TV
                     */
                    tv: {
                        name: 'TV',
                        codename: 'tv',
                        id: '47511b09-6c39-fa04-ff59-7c47551e827f',
                        externalId: undefined,
                        terms: {}
                    },

                    /**
                     * Blockbuster
                     */
                    blockbuster: {
                        name: 'Blockbuster',
                        codename: 'blockbuster',
                        id: '875a4657-1dcd-0415-cb3a-892078f5991a',
                        externalId: undefined,
                        terms: {}
                    },

                    /**
                     * Cinema only
                     */
                    cinema_only: {
                        name: 'Cinema only',
                        codename: 'cinema_only',
                        id: 'e15c4e32-ab7c-57a2-1b66-d8e3566a1dd2',
                        externalId: undefined,
                        terms: {}
                    }
                }
            }
        }
    },

    /**
     * releasecategory
     */
    releasecategory: {
        name: 'ReleaseCategory',
        codename: 'releasecategory',
        externalId: undefined,
        id: '09b6a348-0f86-7a68-4af3-7cab9a5c60b7',
        terms: {
            /**
             * Global release
             */
            global_release: {
                name: 'Global release',
                codename: 'global_release',
                id: '4acaf439-9f3a-f34a-6211-d3fc6ec7152e',
                externalId: undefined,
                terms: {}
            },

            /**
             * US only
             */
            us_only: {
                name: 'US only',
                codename: 'us_only',
                id: 'b03d990a-55a9-601e-dd5c-aa2edc8698ca',
                externalId: undefined,
                terms: {}
            },

            /**
             * Local release
             */
            local_release: {
                name: 'Local release',
                codename: 'local_release',
                id: '37e55484-f0dc-14eb-bf2a-b0293a0d1b1f',
                externalId: undefined,
                terms: {}
            }
        }
    }
} as const;
