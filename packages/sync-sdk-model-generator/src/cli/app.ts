#!/usr/bin/env node
import { argumentsSetter, commandOptions, runCliAsync } from "@kontent-ai/model-generator-shared";
import { syncConfig } from "../config.js";
import { syncActionAsync } from "./sync-action.js";

// This enables --help with all options & samples
argumentsSetter()
	.withDefaultCommand({
		description: `Generates models for '${syncConfig.npmPackageName}' library`,
		examples: [`kontent-generate-sync --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
		options: [
			commandOptions.environmentId,
			commandOptions.managementApiKey,
			commandOptions.addTimestamp,
			commandOptions.moduleFileExtension,
			commandOptions.outputDir,
			commandOptions.managementBaseUrl,
		],
	})
	.withOption(commandOptions.help)
	.registerCommands();

await runCliAsync(syncActionAsync);
