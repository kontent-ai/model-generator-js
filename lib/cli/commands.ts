import { CliAction, LibraryType } from '../core/core.models.js';
import { ModuleResolution } from '../public_api.js';
import { argumentsSetter } from './args/args-setter.js';
import { CommandOption } from './cli.models.js';

const environmentIdOption: CommandOption = {
    name: `environmentId`,
    description: `Id of the environment`,
    type: 'string',
    isRequired: true
};

const apiKeyOption: CommandOption = {
    name: `apiKey`,
    description: `Management API key`,
    type: 'string',
    isRequired: true
};

const outputDirOption: CommandOption = {
    name: `outputDir`,
    description: `Relative directory path where directory will be created`,
    type: 'string',
    isRequired: false
};

const addTimestampOption: CommandOption = {
    name: `outputDir`,
    description: `Indicates whether timestamp should be generated for every file`,
    type: 'boolean',
    isRequired: false
};

const moduleResolutionOption: CommandOption = {
    name: `moduleResolution`,
    description: `Module resolution for imports. Available options are: '${'node' satisfies ModuleResolution}', '${'nodeNext' satisfies ModuleResolution}'`,
    type: 'string',
    isRequired: false
};

const baseUrl: CommandOption = {
    name: `baseUrl`,
    description: `Base URL for Management API`,
    type: 'string',
    isRequired: false
};

export const cliArgs = argumentsSetter()
    .withCommand({
        name: 'delivery-sdk',
        description: `Generates models for '${'@kontent-ai/delivery-sdk' satisfies LibraryType}' library`,
        examples: [`kontent-generate ${'delivery-sdk' satisfies CliAction} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withCommand({
        name: 'environment',
        description: `Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment`,
        examples: [`kontent-generate ${'environment' satisfies CliAction} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withCommand({
        name: 'migration-toolkit',
        description: `Generates models for '${'@kontent-ai/migration-toolkit' satisfies LibraryType}' library`,
        examples: [`kontent-generate ${'migration-toolkit' satisfies CliAction} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withCommand({
        name: 'items',
        description: `Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames`,
        examples: [`kontent-generate ${'items' satisfies CliAction} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withOption({
        alias: `h`,
        name: `help`,
        description: `Show help`,
        isRequired: false
    });
