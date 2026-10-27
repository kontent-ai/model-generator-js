export type CommandOptionNames =
	| "environmentId"
	| "help"
	| "deliveryApiKey"
	| "managementApiKey"
	| "outputDir"
	| "addTimestamp"
	| "moduleFileExtension"
	| "apiMode"
	| "contentTypes"
	| "managementBaseUrl"
	| "deliveryBaseUrl"
	| "entities"
	| "generateTypes"
	| "generateObjects"
	| "disableComments";

export type CommandAlias = "h";

export interface DefaultCommand {
	readonly description: string;
	readonly options: readonly CommandOption[];
	readonly examples: readonly string[];
}

export interface Command<TAction extends string> extends DefaultCommand {
	readonly name: TAction;
}

export interface CommandOption {
	readonly name: CommandOptionNames;
	readonly isRequired: boolean;
	readonly alias?: CommandAlias;
	readonly description?: string;
	readonly type?: "boolean" | "number" | "string";
}

export type CliArgumentsSetter<TAction extends string> = {
	withCommand(command: Command<TAction>): CliArgumentsSetter<TAction>;
	withDefaultCommand(command: DefaultCommand): CliArgumentsSetter<TAction>;
	withOption(option: CommandOption): CliArgumentsSetter<TAction>;
	registerCommands(): void;
};

export type CliArgumentsFetcher = {
	getCommand(): string | undefined;
	getOptionalArgumentValue(argName: CommandOptionNames): string | undefined;
	getRequiredArgumentValue(argName: CommandOptionNames): string;
	getBooleanArgumentValue(argName: CommandOptionNames, defaultValue: boolean): boolean;
	getOptionalArgumentArrayValue(argName: CommandOptionNames): readonly string[];
};
