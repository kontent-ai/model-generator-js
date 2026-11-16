import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { logError } from "../core/error.utils.js";
import type { CliCommand, CommandOption } from "./cli.models.js";
import { resolveCommand } from "./command.js";
import { commandOptions } from "./command.options.js";

const defaultCommandName = "$0";

/**
 * Registers the given commands (enables --help with all commands, options & examples), parses the CLI arguments
 * and runs the matching command. A command without a name is used when no other command matches.
 */
export async function runCliAsync(commands: readonly CliCommand[]): Promise<void> {
	try {
		const rawArgs = await registerCommands(yargs(hideBin(process.argv)), commands).parseAsync();
		const command = resolveCommand(commands, rawArgs._[0]?.toString().toLowerCase());

		await command.runAsync(rawArgs);
	} catch (error) {
		logError(error);
		process.exitCode = 1;
	}
}

function registerCommands(argv: Argv, commands: readonly CliCommand[]): Argv {
	return commands
		.reduce(
			(acc, command) =>
				acc.command(command.name ?? defaultCommandName, command.description, (commandArgv) =>
					configureCommand(commandArgv, command.name ?? defaultCommandName, command),
				),
			argv,
		)
		.option(commandOptions.help.name, toYargsOption(commandOptions.help));
}

function configureCommand(commandArgv: Argv, name: string, command: CliCommand): Argv {
	const withExamples = command.examples.reduce((acc, example) => acc.example(name, example), commandArgv);

	return command.options.reduce((acc, option) => acc.positional(option.name, toYargsOption(option)), withExamples);
}

function toYargsOption(option: CommandOption) {
	return {
		alias: option.alias,
		describe: option.description,
		type: option.type,
		demandOption: option.isRequired,
	} as const;
}
