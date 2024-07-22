import { argumentsSetter } from './args/args-setter.js';

export const cliArgs = argumentsSetter()
    .withCommand({
        name: 'delivery',
        description:
            'Generates Delivery & project models based on the content types and content items in your Kontent.ai project',
        examples: [`kontent-generate delivery --environmentId=x --apiKey=x`],
        options: [
            {
                name: `environmentId`,
                description: `Id of the environment`,
                type: 'string',
                isRequired: true
            },
            {
                name: `apiKey`,
                description: `Management API key`,
                type: 'string',
                isRequired: true
            },
            {
                name: `outputDir`,
                description: `Directory where generated files will be created`,
                type: 'string',
                isRequired: false
            },
            {
                name: `addTimestamp`,
                description: `Indicates if timestamp should be generated`,
                type: 'string',
                isRequired: false
            },
            {
                name: `addEnvironmentInfo`,
                description: `Indicates if environment info stamp should be generated`,
                type: 'string',
                isRequired: false
            },
            {
                name: `moduleResolution`,
                description: `Module resolution for imports. Available options are: node, nodeNext`,
                type: 'string',
                isRequired: false
            },
            {
                name: `isEnterpriseSubscription`,
                description: `Indicates if enterprise subscription endpoint can be used to export data`,
                type: 'string',
                isRequired: false
            },
            {
                name: `sortTaxonomyTerms`,
                description: `Indicates if taxonomy terms are sorted alphabetically`,
                type: 'string',
                isRequired: false
            },
            {
                name: `managementApiUrl`,
                description: `Sets the url of Management API`,
                type: 'string',
                isRequired: false
            }
        ]
    })
    .withOption({
        alias: `h`,
        name: `help`,
        description: `Show help`,
        isRequired: false
    });
