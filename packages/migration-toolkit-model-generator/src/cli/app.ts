#!/usr/bin/env node
import { argumentsSetter, commandOptions, runCliAsync } from "@kontent-ai/model-generator-shared";
import { migrationConfig } from "../config.js";
import { migrateActionAsync } from "./migrate-action.js";

// This enables --help with all options & samples
argumentsSetter()
	.withDefaultCommand({
		description: `Generates models for '${migrationConfig.npmPackageName}' library`,
		examples: [`kontent-generate-migration --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
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

await runCliAsync(migrateActionAsync);
