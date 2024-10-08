import { CliAction } from '../core/core.models.js';

export interface Command<TAction extends string> {
    readonly name: TAction;
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

export type CliArgumentsSetter<TAction extends string> = {
    withCommand(command: Command<TAction>): CliArgumentsSetter<TAction>;
    withOption(option: CommandOption): CliArgumentsSetter<TAction>;
    registerCommands(): void;
};

export type CliArgumentsFetcher = {
    getCliAction(): CliAction;
    getOptionalArgumentValue(argName: string): string | undefined;
    getRequiredArgumentValue(argName: string): string;
    getBooleanArgumentValue(argName: string, defaultValue: boolean): boolean;
    getOptionalArgumentArrayVaue(argName: string): readonly string[];
};
