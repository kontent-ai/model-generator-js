import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CliArgumentsSetter, Command, CommandOption } from '../cli.models.js';

export function argumentsSetter(): CliArgumentsSetter {
    const argv = yargs(hideBin(process.argv));

    return {
        withCommand(command: Command): CliArgumentsSetter {
            argv.command(command.name, command.description, (yargs) => {
                command.examples.forEach((example) => yargs.example(command.name, example));
                command.options.forEach((option) => {
                    yargs.positional(option.name, {
                        alias: option.alias,
                        describe: option.description,
                        type: option.type,
                        demandOption: option.isRequired
                    });
                });
            });

            return this;
        },
        withOption(option: CommandOption): CliArgumentsSetter {
            argv.option(option.name, {
                alias: option.alias,
                description: option.description,
                type: option.type,
                demandOption: option.isRequired
            });

            return this;
        },
        registerCommands(): void {
            argv.parseSync();
        }
    };
}
