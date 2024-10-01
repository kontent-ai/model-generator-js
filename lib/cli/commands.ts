import { CliAction, DeliveryApiMode, LibraryType, ModuleFileExtension } from '../core/core.models.js';
import { argumentsSetter } from './args/args-setter.js';
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
    description: `Module resolution for imports. Available options are: '${'js' satisfies ModuleFileExtension}', '${'ts' satisfies ModuleFileExtension}' or '${'none' satisfies ModuleFileExtension}' (no extension) }`,
    type: 'string',
    isRequired: false
};

export const apiModeOption: CommandOption = {
    name: `apiMode`,
    description: `API mode for Delivery. Options are '${'default' satisfies DeliveryApiMode}', '${'preview' satisfies DeliveryApiMode}' or '${'secure' satisfies DeliveryApiMode}'`,
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
    name: `generateTypes`,
    description: `Indicates if objects (const variables) representing data are generated`,
    type: 'boolean',
    isRequired: false
};

export const cliArgs = argumentsSetter()
    .withCommand({
        name: 'delivery-sdk',
        description: `Generates models for '${'@kontent-ai/delivery-sdk' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'delivery-sdk' satisfies CliAction} --${environmentIdOption.name}=x --${managementApiKeyOption.name}=x`
        ],
        options: [
            environmentIdOption,
            managementApiKeyOption,
            addTimestampOption,
            moduleFileExtensionOption,
            outputDirOption,
            managementBaseUrlOption
        ]
    })
    .withCommand({
        name: 'environment',
        description: `Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment`,
        examples: [
            `kontent-generate ${'environment' satisfies CliAction} --${environmentIdOption.name}=x --${managementApiKeyOption.name}=x`
        ],
        options: [
            environmentIdOption,
            managementApiKeyOption,
            addTimestampOption,
            moduleFileExtensionOption,
            outputDirOption,
            managementBaseUrlOption,
            isEnterpriseSubscriptionOption
        ]
    })
    .withCommand({
        name: 'migration-toolkit',
        description: `Generates models for '${'@kontent-ai/migration-toolkit' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'migration-toolkit' satisfies CliAction} --${environmentIdOption.name}=x --${managementApiKeyOption.name}=x`
        ],
        options: [
            environmentIdOption,
            managementApiKeyOption,
            addTimestampOption,
            moduleFileExtensionOption,
            outputDirOption,
            managementBaseUrlOption
        ]
    })
    .withCommand({
        name: 'items',
        description: `Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames.`,
        examples: [
            `kontent-generate ${'items' satisfies CliAction} --${environmentIdOption.name}=x --${managementApiKeyOption.name}=x --${deliveryApiKeyOption.name}=x --${apiModeOption.name}=preview --${contentTypesOption.name}=a,b,c`
        ],
        options: [
            environmentIdOption,
            managementApiKeyOption,
            deliveryApiKeyOption,
            addTimestampOption,
            moduleFileExtensionOption,
            outputDirOption,
            managementBaseUrlOption,
            apiModeOption,
            contentTypesOption,
            deliveryBaseUrlOption,
            generateTypesOption,
            generateObjectsOption
        ]
    })
    .withOption({
        alias: `h`,
        name: `help`,
        description: `Show help`,
        isRequired: false
    });
