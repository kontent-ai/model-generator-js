import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import type { CliArgumentsSetter, Command, CommandOption, DefaultCommand } from "../cli.models.js";

const defaultCommandName = "$0";

export function argumentsSetter<TAction extends string>(): CliArgumentsSetter<TAction> {
	const argv = yargs(hideBin(process.argv));

	const registerCommand = (name: string, command: DefaultCommand): void => {
		argv.command(name, command.description, (commandArgv) => configureCommand(commandArgv, name, command));
	};

	return {
		withCommand(command: Command<TAction>): CliArgumentsSetter<TAction> {
			registerCommand(command.name, command);
			return this;
		},
		withDefaultCommand(command: DefaultCommand): CliArgumentsSetter<TAction> {
			registerCommand(defaultCommandName, command);
			return this;
		},
		withOption(option: CommandOption): CliArgumentsSetter<TAction> {
			argv.option(option.name, {
				alias: option.alias,
				description: option.description,
				type: option.type,
				demandOption: option.isRequired,
			});

			return this;
		},
		registerCommands(): void {
			argv.parseSync();
		},
	};
}

function configureCommand(commandArgv: Argv, name: string, command: DefaultCommand): void {
	for (const example of command.examples) {
		commandArgv.example(name, example);
	}

	for (const option of command.options) {
		commandArgv.positional(option.name, {
			alias: option.alias,
			describe: option.description,
			type: option.type,
			demandOption: option.isRequired,
		});
	}
}
