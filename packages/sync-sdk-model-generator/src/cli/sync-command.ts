import { commandOptions, defineCommand, type ExhaustiveConfig } from "@kontent-ai/model-generator-shared";
import { syncConfig } from "../config.js";
import { type GenerateSyncModelsConfig, generateSyncModelsAsync } from "../generators/sync-func.js";

export const syncCommand = defineCommand({
	description: `Generates models for '${syncConfig.npmPackageName}' library`,
	examples: [`kontent-generate-sync --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
	options: [
		commandOptions.environmentId,
		commandOptions.managementApiKey,
		commandOptions.addTimestamp,
		commandOptions.moduleFileExtension,
		commandOptions.outputDir,
		commandOptions.managementBaseUrl,
		commandOptions.disableComments,
	],
	action: async (args) => {
		await generateSyncModelsAsync({
			createFiles: true,
			environmentId: args.environmentId,
			managementApiKey: args.managementApiKey,
			addTimestamp: args.addTimestamp,
			moduleFileExtension: args.moduleFileExtension,
			outputDir: args.outputDir,
			managementBaseUrl: args.managementBaseUrl,
			disableComments: args.disableComments,
			formatOptions: undefined,
		} satisfies ExhaustiveConfig<GenerateSyncModelsConfig>);
	},
});
