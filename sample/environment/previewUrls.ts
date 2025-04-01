
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.0.0'.
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

export const previewUrls = {
    /**
     * Preview configuration
     */
    spaceDomains: {
        movies: {
            spaceName: 'Movies',
            spaceCodename: 'movies',
            domain: 'https://siteA.com'
        },

        global: {
            spaceName: 'Global',
            spaceCodename: 'global',
            domain: 'https://siteB.com'
        }
    },
    previewUrlPatterns: {
        actor: {
            contentTypeName: 'Actor',
            contentTypeCodename: 'actor',
            urlPatterns: {
                default: {
                    spaceName: undefined,
                    spaceCodename: undefined,
                    url: 'https://sample.com/{codename}'
                }
            }
        },

        movie: {
            contentTypeName: 'Movie',
            contentTypeCodename: 'movie',
            urlPatterns: {
                movies: {
                    spaceName: 'Movies',
                    spaceCodename: 'movies',
                    url: 'https://sample.com/movieA/{itemId}'
                },

                global: {
                    spaceName: 'Global',
                    spaceCodename: 'global',
                    url: 'https://sample.com/movieB/{itemId}'
                }
            }
        }
    }
} as const;
