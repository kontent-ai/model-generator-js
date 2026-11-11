import { colorize } from "@kontent-ai/core-sdk/devkit";
import { getCliArgs, parseCliArgsAsync } from "../arg.utils.js";
import type { CliArgumentsFetcher } from "../cli.models.js";

export async function argumentsFetcherAsync(): Promise<CliArgumentsFetcher> {
	const parsedArgs = await parseCliArgsAsync(getCliArgs());

	const getOptionalArgumentValue = (argName: string) => {
		return parsedArgs[argName]?.toString();
	};

	return {
		getCommand(): string | undefined {
			return parsedArgs._[0]?.toString().toLowerCase();
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
