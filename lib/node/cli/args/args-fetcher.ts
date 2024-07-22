import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { CliArgumentsFetcher } from '../cli.models.js';
import { CliAction } from '../../../core/core.models.js';
import { exitProgram } from '../../../core/index.js';

type ArgvResult = {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
};

export async function argumentsFetcherAsync(): Promise<CliArgumentsFetcher> {
    const argv = yargs(hideBin(process.argv));
    const resolvedArgv: ArgvResult = await argv.argv;

    const getOptionalArgumentValue = (argName: string) => {
        return resolvedArgv[argName]?.toString();
    };

    return {
        getCliAction(): CliAction {
            const command = resolvedArgv._?.[0]?.toString()?.toLowerCase();

            if (command === <CliAction>'delivery') {
                return 'delivery';
            }
            if (command === <CliAction>'migration') {
                return 'migration';
            }

            throw Error(`Unsupported command '${chalk.yellow(command)}'`);
        },
        getOptionalArgumentValue(argName: string): string | undefined {
            return resolvedArgv[argName]?.toString();
        },
        getRequiredArgumentValue(argName: string): string {
            const value = getOptionalArgumentValue(argName);

            if (!value) {
                exitProgram({
                    message: `Missing '${chalk.yellow(argName)}' argument value`
                });
            }

            return value;
        },
        getBooleanArgumentValue(argName: string, defaultValue: boolean): boolean {
            const value = getOptionalArgumentValue(argName);

            if (!value) {
                return defaultValue;
            }

            return value.toLowerCase() === 'true'.toLowerCase();
        }
    };
}
