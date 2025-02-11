import { deliveryApiModeOptions, moduleFileExtensionOptions } from './arg.utils.js';
import { CommandOption } from './cli.models.js';

export const commandOptions: { [key: string]: CommandOption } = {
    environmentIdOption: { name: `environmentId`, description: `Id of the environment`, type: 'string', isRequired: true },
    managementApiKeyOption: { name: `apiKey`, description: `Management API key`, type: 'string', isRequired: true },
    deliveryApiKeyOption: { name: `apiKey`, description: `Delivery API key`, type: 'string', isRequired: true },
    outputDirOption: {
        name: `outputDir`,
        description: `Relative directory path where directory will be created`,
        type: 'string',
        isRequired: false
    },
    addTimestampOption: {
        name: `outputDir`,
        description: `Indicates whether timestamp should be generated for every file`,
        type: 'boolean',
        isRequired: false
    },
    moduleFileExtensionOption: {
        name: `moduleFileExtension`,
        description: `Module resolution for imports. One of: ${Object.values(moduleFileExtensionOptions).join(', ')}`,
        type: 'string',
        isRequired: false
    },
    apiModeOption: {
        name: `apiMode`,
        description: `API mode for Delivery. ${Object.values(deliveryApiModeOptions).join(', ')}`,
        type: 'string',
        isRequired: false
    },
    contentTypesOption: {
        name: `contentTypes`,
        description: `CSV of content types to generate models for. If not provided, all items will be generated`,
        type: 'string',
        isRequired: false
    },
    isEnterpriseSubscriptionOption: {
        name: `isEnterpriseSubscription`,
        description: `Indicates if the subscription is Enterprise. If true, the generator will generate models for Enterprise features`,
        type: 'boolean',
        isRequired: false
    },
    managementBaseUrlOption: { name: `baseUrl`, description: `Base URL for Management API`, type: 'string', isRequired: false },
    deliveryBaseUrlOption: { name: `deliveryBaseUrl`, description: `Base URL for Delivery API`, type: 'string', isRequired: false },
    generateTypesOption: {
        name: `generateTypes`,
        description: `Indicates if Typescript types representing data are generated`,
        type: 'boolean',
        isRequired: false
    },
    generateObjectsOption: {
        name: `generateObjects`,
        description: `Indicates if objects (const variables) representing data are generated`,
        type: 'boolean',
        isRequired: false
    }
};
