/**
 * Generated by '@kentico/kontent-model-generator@4.1.0' at 'Tue, 19 Apr 2022 09:39:56 GMT'
 *
 * Movie Database
 * Id: da5abe9f-fdad-4168-97cd-b3464be2ccb9
 * Environment: Production
 */
export const projectModel = {
  languages: {
    /**
     * English
     * Id: 00000000-0000-0000-0000-000000000000
     * Codename: en
     * Is Active: true
     * Is Default: true
     * Fallback language Id: 00000000-0000-0000-0000-000000000000
     */
    en: {
      codename: 'en',
      id: '00000000-0000-0000-0000-000000000000',
      name: 'English',
    },

    /**
     * cz
     * Id: 41ccb26f-ceab-04d0-6ffa-9c7c5358aa8f
     * Codename: cz
     * Is Active: true
     * Is Default: false
     * Fallback language Id: 00000000-0000-0000-0000-000000000000
     */
    cz: {
      codename: 'cz',
      id: '41ccb26f-ceab-04d0-6ffa-9c7c5358aa8f',
      name: 'cz',
    },

    /**
     * German
     * Id: 14f7bcc0-4fd6-4b77-8c22-70e5ccfdae1d
     * Codename: German
     * Is Active: false
     * Is Default: false
     * Fallback language Id: 00000000-0000-0000-0000-000000000000
     */
    German: {
      codename: 'German',
      id: '14f7bcc0-4fd6-4b77-8c22-70e5ccfdae1d',
      name: 'German',
    },
  },
  contentTypes: {
    /**
     * Movie
     * Id: b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c
     * Codename: movie
     */
    movie: {
      codename: 'movie',
      id: 'b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c',
      name: 'Movie',
      elements: {
        /**
         * Title (text)
         * Required: true
         * Id: 3473187e-dc78-eff2-7099-f690f7042d4a
         * Codename: title
         */
        title: {
          codename: 'title',
          id: '3473187e-dc78-eff2-7099-f690f7042d4a',
          name: 'Title',
        },

        /**
         * Plot (rich_text)
         * Required: false
         * Id: f7ee4f27-27fd-a19b-3c5c-102aae1c50ce
         * Codename: plot
         */
        plot: {
          codename: 'plot',
          id: 'f7ee4f27-27fd-a19b-3c5c-102aae1c50ce',
          name: 'Plot',
        },

        /**
         * Released (date_time)
         * Required: false
         * Id: 5ccf4644-0d65-5d96-9a32-f4ea21974d51
         * Codename: released
         */
        released: {
          codename: 'released',
          id: '5ccf4644-0d65-5d96-9a32-f4ea21974d51',
          name: 'Released',
        },

        /**
         * Length (number)
         * Required: false
         * Id: 7e8ecfab-a419-27ee-d8ec-8adb76fd007c
         * Codename: length
         */
        length: {
          codename: 'length',
          id: '7e8ecfab-a419-27ee-d8ec-8adb76fd007c',
          name: 'Length',
        },

        /**
         * Poster (asset)
         * Required: false
         * Id: a39a7237-9503-a1ae-8431-5b6cdb85ae9d
         * Codename: poster
         */
        poster: {
          codename: 'poster',
          id: 'a39a7237-9503-a1ae-8431-5b6cdb85ae9d',
          name: 'Poster',
        },

        /**
         * Category (multiple_choice)
         * Required: false
         * Id: 9821c252-6414-f549-c17f-cc171dd87713
         * Codename: category
         */
        category: {
          codename: 'category',
          id: '9821c252-6414-f549-c17f-cc171dd87713',
          name: 'Category',
        },

        /**
         * Stars (modular_content)
         * Required: false
         * Id: aa26a55d-19f8-7501-fea3-b0d9b1eeac71
         * Codename: stars
         */
        stars: {
          codename: 'stars',
          id: 'aa26a55d-19f8-7501-fea3-b0d9b1eeac71',
          name: 'Stars',
        },

        /**
         * SeoName (url_slug)
         * Required: false
         * Id: 756cc91a-a090-60f9-a7f0-f505bfbe046c
         * Codename: seoname
         */
        seoname: {
          codename: 'seoname',
          id: '756cc91a-a090-60f9-a7f0-f505bfbe046c',
          name: 'SeoName',
        },
      },
    },

    /**
     * Actor
     * Id: 58099989-319f-495f-aa36-cb3710854e36
     * Codename: actor
     */
    actor: {
      codename: 'actor',
      id: '58099989-319f-495f-aa36-cb3710854e36',
      name: 'Actor',
      elements: {
        /**
         * Url (url_slug)
         * Required: false
         * Id: c8658782-f209-a573-9c85-430fb4e3e9f0
         * Codename: url
         */
        url: {
          codename: 'url',
          id: 'c8658782-f209-a573-9c85-430fb4e3e9f0',
          name: 'Url',
        },

        /**
         * First name (text)
         * Required: true
         * Id: 14dd70e5-c42d-f111-9640-c82b443edf1d
         * Codename: first_name
         *
         * This is the first name of the actor
         */
        first_name: {
          codename: 'first_name',
          id: '14dd70e5-c42d-f111-9640-c82b443edf1d',
          name: 'First name',
        },

        /**
         * Last name (text)
         * Required: true
         * Id: 9f7a0dd4-af3a-95ca-0358-400c14ce7075
         * Codename: last_name
         */
        last_name: {
          codename: 'last_name',
          id: '9f7a0dd4-af3a-95ca-0358-400c14ce7075',
          name: 'Last name',
        },

        /**
         * Photo (asset)
         * Required: false
         * Id: eaec9ba3-9624-6875-04ec-80d0b2e00781
         * Codename: photo
         */
        photo: {
          codename: 'photo',
          id: 'eaec9ba3-9624-6875-04ec-80d0b2e00781',
          name: 'Photo',
        },
      },
    },
  },
  taxonomies: {
    /**
     * MovieType
     * Id: 365a17e6-1929-27ab-9f67-a9273c846717
     * Codename: movietype
     */
    movietype: {
      codename: 'movietype',
      id: '365a17e6-1929-27ab-9f67-a9273c846717',
      name: 'MovieType',
      terms: {
        student: {
          codename: 'student',
          id: 'b107e12c-124d-705f-1029-c0dfdd0b2438',
          name: 'Student',
          terms: {},
        },
        film: {
          codename: 'film',
          id: '5a2a1927-41a4-294f-5d89-cf0cc045e943',
          name: 'Film',
          terms: {
            tv: {
              codename: 'tv',
              id: '47511b09-6c39-fa04-ff59-7c47551e827f',
              name: 'TV',
              terms: {},
            },
            blockbuster: {
              codename: 'blockbuster',
              id: '875a4657-1dcd-0415-cb3a-892078f5991a',
              name: 'Blockbuster',
              terms: {},
            },
            cinema_only: {
              codename: 'cinema_only',
              id: 'e15c4e32-ab7c-57a2-1b66-d8e3566a1dd2',
              name: 'Cinema only',
              terms: {},
            },
          },
        },
      },
    },

    /**
     * ReleaseCategory
     * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
     * Codename: releasecategory
     */
    releasecategory: {
      codename: 'releasecategory',
      id: '09b6a348-0f86-7a68-4af3-7cab9a5c60b7',
      name: 'ReleaseCategory',
      terms: {
        global_release: {
          codename: 'global_release',
          id: '4acaf439-9f3a-f34a-6211-d3fc6ec7152e',
          name: 'Global release',
          terms: {},
        },
        us_only: {
          codename: 'us_only',
          id: 'b03d990a-55a9-601e-dd5c-aa2edc8698ca',
          name: 'US only',
          terms: {},
        },
        local_release: {
          codename: 'local_release',
          id: '37e55484-f0dc-14eb-bf2a-b0293a0d1b1f',
          name: 'Local release',
          terms: {},
        },
      },
    },
  },
  workflows: {
    /**
     * Default
     * Id: 00000000-0000-0000-0000-000000000000
     * Codename: default
     */
    default: {
      codename: 'default',
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Default',
    },
  },
};
