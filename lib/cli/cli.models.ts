import type { CliAction } from '../core/core.models.js';

export type CommandOptionNames =
    | 'environmentId'
    | 'help'
    | 'deliveryApiKey'
    | 'managementApiKey'
    | 'outputDir'
    | 'addTimestamp'
    | 'moduleFileExtension'
    | 'apiMode'
    | 'contentTypes'
    | 'managementBaseUrl'
    | 'deliveryBaseUrl'
    | 'entities'
    | 'generateTypes'
    | 'generateObjects';

export type CommandAlias = 'h';

export interface Command<TAction extends string> {
    readonly name: TAction;
    readonly description: string;
    readonly options: readonly CommandOption[];
    readonly examples: readonly string[];
}

export interface CommandOption {
    readonly name: CommandOptionNames;
    readonly isRequired: boolean;
    readonly alias?: CommandAlias;
    readonly description?: string;
    readonly type?: 'boolean' | 'number' | 'string';
}

export type CliArgumentsSetter<TAction extends string> = {
    withCommand(command: Command<TAction>): CliArgumentsSetter<TAction>;
    withOption(option: CommandOption): CliArgumentsSetter<TAction>;
    registerCommands(): void;
};

export type CliArgumentsFetcher = {
    getCliAction(): CliAction;
    getOptionalArgumentValue(argName: CommandOptionNames): string | undefined;
    getRequiredArgumentValue(argName: CommandOptionNames): string;
    getBooleanArgumentValue(argName: CommandOptionNames, defaultValue: boolean): boolean;
    getOptionalArgumentArrayValue(argName: CommandOptionNames): readonly string[];
};
