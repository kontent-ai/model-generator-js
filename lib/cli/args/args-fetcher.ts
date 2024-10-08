import chalk from 'chalk';
import { match } from 'ts-pattern';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CliAction, LiteralUnion } from '../../core/core.models.js';
import { CliArgumentsFetcher } from '../cli.models.js';

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
            const command = resolvedArgv._?.[0]?.toString()?.toLowerCase() as LiteralUnion<CliAction>;

            return match(command)
                .returnType<CliAction>()
                .with('delivery-sdk', () => 'delivery-sdk')
                .with('migration-toolkit', () => 'migration-toolkit')
                .with('environment', () => 'environment')
                .with('items', () => 'items')
                .otherwise(() => {
                    throw Error(`Unsupported command '${chalk.red(command)}'`);
                });
        },
        getOptionalArgumentValue,
        getRequiredArgumentValue(argName: string): string {
            const value = getOptionalArgumentValue(argName);

            if (!value) {
                throw Error(`Missing '${chalk.yellow(argName)}' argument value`);
            }

            return value;
        },
        getBooleanArgumentValue(argName: string, defaultValue: boolean): boolean {
            const value = getOptionalArgumentValue(argName);

            if (!value) {
                return defaultValue;
            }

            return value.toLowerCase() === 'true'.toLowerCase();
        },
        getOptionalArgumentArrayVaue(argName: string): readonly string[] {
            return getOptionalArgumentValue(argName)?.split(',') ?? [];
        }
    };
}
