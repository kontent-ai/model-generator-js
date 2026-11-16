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

/**
 * A CLI option. Its `parse` function turns the raw CLI value into the value passed to the command action,
 * so the option declaration (help, validation) and the value read by the action can never drift apart.
 */
export interface CommandOption<TName extends CommandOptionNames = CommandOptionNames, TValue = unknown> {
	readonly name: TName;
	readonly description: string;
	readonly type: "boolean" | "string";
	readonly isRequired: boolean;
	readonly alias?: CommandAlias;
	readonly parse: (rawValue: string | undefined) => TValue;
}

export type CommandArgs<TOptions extends readonly CommandOption[]> = {
	readonly [TOption in TOptions[number] as TOption["name"]]: ReturnType<TOption["parse"]>;
};

export type RawCliArgs = Readonly<Record<string, unknown>>;

export interface CommandDefinition<TOptions extends readonly CommandOption[]> {
	/**
	 * Name of the command. Omit for the default command (CLI invoked without a command).
	 */
	readonly name?: string;
	readonly description: string;
	readonly examples: readonly string[];
	readonly options: TOptions;
	readonly action: (args: CommandArgs<TOptions>) => Promise<void>;
}

export interface CliCommand {
	readonly name: string | undefined;
	readonly description: string;
	readonly examples: readonly string[];
	readonly options: readonly CommandOption[];
	readonly runAsync: (rawArgs: RawCliArgs) => Promise<void>;
}

/**
 * Requires every property of a generator config (including optional ones) to be set explicitly,
 * so that extending the config breaks compilation of the CLI until the new property is handled.
 */
export type ExhaustiveConfig<TConfig> = TConfig extends unknown ? { readonly [K in keyof Required<TConfig>]: TConfig[K] } : never;
