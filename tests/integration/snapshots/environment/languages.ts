export const languages = {
    /**
     * English
     */
    en: {
        name: 'English',
        codename: 'en',
        id: '00000000-0000-0000-0000-000000000000',
        isActive: true,
        isDefault: true,
        fallbackLanguageId: '00000000-0000-0000-0000-000000000000',
        externalId: undefined
    },

    /**
     * cz
     */
    cz: {
        name: 'cz',
        codename: 'cz',
        id: '41ccb26f-ceab-04d0-6ffa-9c7c5358aa8f',
        isActive: true,
        isDefault: false,
        fallbackLanguageId: '00000000-0000-0000-0000-000000000000',
        externalId: undefined
    },

    /**
     * German
     */
    german: {
        name: 'German',
        codename: 'German',
        id: '14f7bcc0-4fd6-4b77-8c22-70e5ccfdae1d',
        isActive: false,
        isDefault: false,
        fallbackLanguageId: '00000000-0000-0000-0000-000000000000',
        externalId: undefined
    }
} as const;
