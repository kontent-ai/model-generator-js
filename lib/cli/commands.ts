import type { CliAction, LibraryType } from '../core/core.models.js';
import { argumentsSetter } from './args/args-setter.js';
import { commandOptions } from './command.options.js';

export const cliArgs = argumentsSetter()
    .withCommand({
        name: 'delivery-sdk',
        description: `Generates models for '${'@kontent-ai/delivery-sdk' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'delivery-sdk' satisfies CliAction} --${commandOptions.environmentIdOption.name}=x --${commandOptions.managementApiKeyOption.name}=x`
        ],
        options: [
            commandOptions.environmentIdOption,
            commandOptions.managementApiKeyOption,
            commandOptions.addTimestampOption,
            commandOptions.moduleFileExtensionOption,
            commandOptions.outputDirOption,
            commandOptions.managementBaseUrlOption
        ]
    })
    .withCommand({
        name: 'environment',
        description: `Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment`,
        examples: [
            `kontent-generate ${'environment' satisfies CliAction} --${commandOptions.environmentIdOption.name}=x --${commandOptions.managementApiKeyOption.name}=x`
        ],
        options: [
            commandOptions.environmentIdOption,
            commandOptions.managementApiKeyOption,
            commandOptions.addTimestampOption,
            commandOptions.moduleFileExtensionOption,
            commandOptions.outputDirOption,
            commandOptions.managementBaseUrlOption,
            commandOptions.isEnterpriseSubscriptionOption
        ]
    })
    .withCommand({
        name: 'migration-toolkit',
        description: `Generates models for '${'@kontent-ai/migration-toolkit' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'migration-toolkit' satisfies CliAction} --${commandOptions.environmentIdOption.name}=x --${commandOptions.managementApiKeyOption.name}=x`
        ],
        options: [
            commandOptions.environmentIdOption,
            commandOptions.managementApiKeyOption,
            commandOptions.addTimestampOption,
            commandOptions.moduleFileExtensionOption,
            commandOptions.outputDirOption,
            commandOptions.managementBaseUrlOption
        ]
    })
    .withCommand({
        name: 'items',
        description: `Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames.`,
        examples: [
            `kontent-generate ${'items' satisfies CliAction} --${commandOptions.environmentIdOption.name}=x --${commandOptions.managementApiKeyOption.name}=x --${commandOptions.deliveryApiKeyOption.name}=x --${commandOptions.apiModeOption.name}=preview --${commandOptions.contentTypesOption.name}=a,b,c`
        ],
        options: [
            commandOptions.environmentIdOption,
            commandOptions.managementApiKeyOption,
            commandOptions.deliveryApiKeyOption,
            commandOptions.addTimestampOption,
            commandOptions.moduleFileExtensionOption,
            commandOptions.outputDirOption,
            commandOptions.managementBaseUrlOption,
            commandOptions.apiModeOption,
            commandOptions.contentTypesOption,
            commandOptions.deliveryBaseUrlOption,
            commandOptions.generateTypesOption,
            commandOptions.generateObjectsOption
        ]
    })
    .withOption({
        alias: `h`,
        name: `help`,
        description: `Show help`,
        isRequired: false
    });
