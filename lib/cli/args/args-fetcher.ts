import { colorize } from "@kontent-ai/core-sdk/devkit";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { CliArgumentsFetcher } from "../cli.models.js";

type ArgvResult = {
	readonly [x: string]: unknown;
	readonly _: readonly (string | number)[];
	readonly $0: string;
};

export async function argumentsFetcherAsync(): Promise<CliArgumentsFetcher> {
	const argv = yargs(hideBin(process.argv));
	const resolvedArgv: ArgvResult = await argv.argv;

	const getOptionalArgumentValue = (argName: string) => {
		return resolvedArgv[argName]?.toString();
	};

	return {
		getCommand(): string | undefined {
			return resolvedArgv._[0]?.toString().toLowerCase();
		},
		getOptionalArgumentValue,
		getRequiredArgumentValue(argName: string): string {
			const value = getOptionalArgumentValue(argName);

			if (!value) {
				throw new Error(`Missing '${colorize("yellow", argName)}' argument value`);
			}

			return value;
		},
		getBooleanArgumentValue(argName: string, defaultValue: boolean): boolean {
			const value = getOptionalArgumentValue(argName);

			if (!value) {
				return defaultValue;
			}

			return value.toLowerCase() === "true".toLowerCase();
		},
		getOptionalArgumentArrayValue(argName: string): readonly string[] {
			return getOptionalArgumentValue(argName)?.split(",") ?? [];
		},
	};
}
