import type { CliAction, LibraryType } from '../core/core.models.js';
import { argumentsSetter } from './args/args-setter.js';
import { commandOptions } from './command.options.js';

export const cliArgs = argumentsSetter()
    .withCommand({
        name: 'delivery-sdk',
        description: `Generates models for '${'@kontent-ai/delivery-sdk' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'delivery-sdk' satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`
        ],
        options: [
            commandOptions.environmentId,
            commandOptions.managementApiKey,
            commandOptions.addTimestamp,
            commandOptions.moduleFileExtension,
            commandOptions.outputDir,
            commandOptions.managementBaseUrl
        ]
    })
    .withCommand({
        name: 'environment',
        description: `Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment`,
        examples: [
            `kontent-generate ${'environment' satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`
        ],
        options: [
            commandOptions.environmentId,
            commandOptions.managementApiKey,
            commandOptions.addTimestamp,
            commandOptions.moduleFileExtension,
            commandOptions.outputDir,
            commandOptions.managementBaseUrl
        ]
    })
    .withCommand({
        name: 'migration-toolkit',
        description: `Generates models for '${'@kontent-ai/migration-toolkit' satisfies LibraryType}' library`,
        examples: [
            `kontent-generate ${'migration-toolkit' satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`
        ],
        options: [
            commandOptions.environmentId,
            commandOptions.managementApiKey,
            commandOptions.addTimestamp,
            commandOptions.moduleFileExtension,
            commandOptions.outputDir,
            commandOptions.managementBaseUrl
        ]
    })
    .withCommand({
        name: 'items',
        description: `Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames.`,
        examples: [
            `kontent-generate ${'items' satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x --${commandOptions.deliveryApiKey.name}=x --${commandOptions.apiMode.name}=preview --${commandOptions.contentTypes.name}=a,b,c`
        ],
        options: [
            commandOptions.environmentId,
            commandOptions.managementApiKey,
            commandOptions.deliveryApiKey,
            commandOptions.addTimestamp,
            commandOptions.moduleFileExtension,
            commandOptions.outputDir,
            commandOptions.managementBaseUrl,
            commandOptions.apiMode,
            commandOptions.contentTypes,
            commandOptions.deliveryBaseUrl,
            commandOptions.generateTypes,
            commandOptions.generateObjects
        ]
    })
    .withOption(commandOptions.help);
