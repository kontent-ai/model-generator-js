import { colorize } from "@kontent-ai/core-sdk/devkit";
import { ModelGeneratorError } from "../core/model-generator.error.js";
import type { CliCommand, CommandArgs, CommandDefinition, CommandOption, RawCliArgs } from "./cli.models.js";

/**
 * Defines a CLI command. Options declared here are used both for help / validation and for the
 * typed `args` passed to `action`, so an action can only read options the command declares.
 */
export function defineCommand<const TOptions extends readonly CommandOption[]>(definition: CommandDefinition<TOptions>): CliCommand {
	return {
		name: definition.name,
		description: definition.description,
		examples: definition.examples,
		options: definition.options,
		runAsync: async (rawArgs) => await definition.action(parseCommandArgs(definition.options, rawArgs)),
	};
}

export function parseCommandArgs<const TOptions extends readonly CommandOption[]>(
	options: TOptions,
	rawArgs: RawCliArgs,
): CommandArgs<TOptions> {
	return Object.fromEntries(
		options.map((option) => [option.name, option.parse(toRawValue(rawArgs[option.name]))]),
	) as CommandArgs<TOptions>;
}

export function resolveCommand(commands: readonly CliCommand[], commandName: string | undefined): CliCommand {
	const command =
		commands.find((command) => command.name !== undefined && command.name === commandName) ??
		commands.find((command) => command.name === undefined);

	if (!command) {
		throw new ModelGeneratorError({
			message: `Unsupported command '${colorize("red", commandName ?? "")}'`,
			reason: "unsupportedCommand",
			details: { command: commandName, supportedCommands: commands.flatMap((command) => (command.name ? [command.name] : [])) },
		});
	}

	return command;
}

function toRawValue(value: unknown): string | undefined {
	return value === undefined || value === null ? undefined : String(value);
}
