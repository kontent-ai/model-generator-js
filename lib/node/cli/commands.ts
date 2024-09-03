import { getCliAction, getLibrary, getModuleResolution } from '../../core/index.js';
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
    description: `Module resolution for imports. Available options are: '${getModuleResolution('node')}', '${getModuleResolution('nodeNext')}'`,
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
        name: getCliAction('delivery-sdk'),
        description: `Generates models for '${getLibrary('@kontent-ai/delivery-sdk')}' library`,
        examples: [`kontent-generate ${getCliAction('delivery-sdk')} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withCommand({
        name: getCliAction('environment'),
        description: `Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment`,
        examples: [`kontent-generate ${getCliAction('environment')} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withCommand({
        name: getCliAction('migration-toolkit'),
        description: `Generates models for '${getLibrary('@kontent-ai/migration-toolkit')}' library`,
        examples: [`kontent-generate ${getCliAction('migration-toolkit')} --${environmentIdOption.name}=x --${apiKeyOption.name}=x`],
        options: [environmentIdOption, apiKeyOption, addTimestampOption, moduleResolutionOption, outputDirOption, baseUrl]
    })
    .withOption({
        alias: `h`,
        name: `help`,
        description: `Show help`,
        isRequired: false
    });
