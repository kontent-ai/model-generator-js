#!/usr/bin/env node
import { argumentsSetter, commandOptions, runCliAsync } from "@kontent-ai/model-generator-shared";
import { deliveryConfig } from "../config.js";
import { deliveryActionAsync } from "./delivery-action.js";

// This enables --help with all options & samples
argumentsSetter()
	.withDefaultCommand({
		description: `Generates models for '${deliveryConfig.npmPackageName}' library`,
		examples: [`kontent-generate-delivery --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
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

await runCliAsync(deliveryActionAsync);
