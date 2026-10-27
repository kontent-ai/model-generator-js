#!/usr/bin/env node
import { colorize } from "@kontent-ai/core-sdk/devkit";
import { runCliAsync } from "@kontent-ai/model-generator-shared";
import { match } from "ts-pattern";
import { cliArgs } from "./commands.js";
import { environmentActionAsync } from "./environment-action.js";
import { itemsActionAsync } from "./items-action.js";

// This enables --help with all commands, options & samples
cliArgs.registerCommands();

await runCliAsync(async (argsFetcher) => {
	const command = argsFetcher.getCommand();

	await match(command)
		.returnType<Promise<void>>()
		.with("environment", async () => await environmentActionAsync(argsFetcher))
		.with("items", async () => await itemsActionAsync(argsFetcher))
		.otherwise(() => {
			throw new Error(`Unsupported command '${colorize("red", command ?? "")}'`);
		});
});
