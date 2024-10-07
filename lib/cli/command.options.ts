import { deliveryApiModeOptions, moduleFileExtensionOptions } from './arg.utils.js';
import { CommandOption } from './cli.models.js';

export const environmentIdOption: CommandOption = {
    name: `environmentId`,
    description: `Id of the environment`,
    type: 'string',
    isRequired: true
};

export const managementApiKeyOption: CommandOption = {
    name: `apiKey`,
    description: `Management API key`,
    type: 'string',
    isRequired: true
};

export const deliveryApiKeyOption: CommandOption = {
    name: `apiKey`,
    description: `Delivery API key`,
    type: 'string',
    isRequired: true
};

export const outputDirOption: CommandOption = {
    name: `outputDir`,
    description: `Relative directory path where directory will be created`,
    type: 'string',
    isRequired: false
};

export const addTimestampOption: CommandOption = {
    name: `outputDir`,
    description: `Indicates whether timestamp should be generated for every file`,
    type: 'boolean',
    isRequired: false
};

export const moduleFileExtensionOption: CommandOption = {
    name: `moduleFileExtension`,
    description: `Module resolution for imports. One of: ${Object.values(moduleFileExtensionOptions).join(', ')}`,
    type: 'string',
    isRequired: false
};

export const apiModeOption: CommandOption = {
    name: `apiMode`,
    description: `API mode for Delivery. ${Object.values(deliveryApiModeOptions).join(', ')}`,
    type: 'string',
    isRequired: false
};

export const contentTypesOption: CommandOption = {
    name: `contentTypes`,
    description: `CSV of content types to generate models for. If not provided, all items will be generated`,
    type: 'string',
    isRequired: false
};

export const isEnterpriseSubscriptionOption: CommandOption = {
    name: `isEnterpriseSubscription`,
    description: `Indicates if the subscription is Enterprise. If true, the generator will generate models for Enterprise features`,
    type: 'boolean',
    isRequired: false
};

export const managementBaseUrlOption: CommandOption = {
    name: `baseUrl`,
    description: `Base URL for Management API`,
    type: 'string',
    isRequired: false
};

export const deliveryBaseUrlOption: CommandOption = {
    name: `deliveryBaseUrl`,
    description: `Base URL for Delivery API`,
    type: 'string',
    isRequired: false
};

export const generateTypesOption: CommandOption = {
    name: `generateTypes`,
    description: `Indicates if Typescript types representing data are generated`,
    type: 'boolean',
    isRequired: false
};

export const generateObjectsOption: CommandOption = {
    name: `generateObjects`,
    description: `Indicates if objects (const variables) representing data are generated`,
    type: 'boolean',
    isRequired: false
};
