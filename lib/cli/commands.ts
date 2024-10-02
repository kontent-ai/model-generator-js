import { CliAction, LibraryType } from '../core/core.models.js';
import { argumentsSetter } from './args/args-setter.js';
import {
    addTimestampOption,
    apiModeOption,
    contentTypesOption,
    deliveryApiKeyOption,
    deliveryBaseUrlOption,
    environmentIdOption,
    generateObjectsOption,
    generateTypesOption,
    isEnterpriseSubscriptionOption,
    managementApiKeyOption,
    managementBaseUrlOption,
    moduleFileExtensionOption,
    outputDirOption
} from './command.options.js';

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
