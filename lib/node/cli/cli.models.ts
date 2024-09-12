import { CliAction } from '../../core/core.models.js';

export interface Command {
    readonly name: string;
    readonly description: string;
    readonly options: readonly CommandOption[];
    readonly examples: readonly string[];
}

export interface CommandOption {
    readonly name: string;
    readonly isRequired: boolean;
    readonly alias?: string;
    readonly description?: string;
    readonly type?: 'boolean' | 'number' | 'string';
}

export type CliArgumentsSetter = {
    withCommand(command: Command): CliArgumentsSetter;
    withOption(option: CommandOption): CliArgumentsSetter;
    registerCommands(): void;
};

export type CliArgumentsFetcher = {
    getCliAction(): CliAction;
    getOptionalArgumentValue(argName: string): string | undefined;
    getRequiredArgumentValue(argName: string): string;
    getBooleanArgumentValue(argName: string, defaultValue: boolean): boolean;
};
