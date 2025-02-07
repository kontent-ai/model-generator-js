
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.0.0-14'.
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

export const workflows = {
    /**
     * Default
     */
    default: {
        name: 'Default',
        codename: 'default',
        id: '00000000-0000-0000-0000-000000000000',
        steps: {
            draft: {
                name: 'Draft',
                codename: 'draft',
                id: 'e3ef0816-2203-4456-bfdc-a735b4f339ab'
            },
            review: {
                name: 'Review',
                codename: 'review',
                id: 'c5682935-f5a2-4514-8025-57d8bdf7558d'
            },
            ready_to_publish: {
                name: 'Ready to publish',
                codename: 'ready_to_publish',
                id: 'aaee1d73-f0cc-4185-9e49-844d161c3634'
            },
            scheduled: {
                name: 'Scheduled',
                codename: 'scheduled',
                id: '9d2b0228-4d0d-4c23-8b49-01a698857709'
            },
            published: {
                name: 'Published',
                codename: 'published',
                id: 'f05b8a85-c6cc-429a-ac6d-21d5edd268fe'
            },
            archived: {
                name: 'Archived',
                codename: 'archived',
                id: '7a535a69-ad34-47f8-806a-def1fdf4d391'
            }
        }
    }
} as const;
