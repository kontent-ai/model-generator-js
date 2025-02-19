export const roles = {
    /**
     * Content contributor
     */
    contentContributor: {
        codename: undefined,
        id: 'dca0ac85-274f-429e-b00e-6f74bf917051',
        name: 'Content contributor'
    },

    /**
     * Reviewer
     */
    reviewer: {
        codename: undefined,
        id: '94478afa-d898-45dd-8300-ba61b6e0eb4b',
        name: 'Reviewer'
    },

    /**
     * Project manager
     */
    projectManager: {
        codename: 'project-manager',
        id: 'af95ac37-4efa-4b92-aa26-db773cd172c6',
        name: 'Project manager'
    },

    /**
     * Developer
     */
    developer: {
        codename: undefined,
        id: 'b3994090-0818-4969-816b-f4c5d3e526f3',
        name: 'Developer'
    }
} as const;
