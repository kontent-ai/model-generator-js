import { commandOptions, defineCommand, type ExhaustiveConfig } from "@kontent-ai/model-generator-shared";
import { migrationConfig } from "../config.js";
import { type GenerateMigrationModelsConfig, generateMigrationModelsAsync } from "../generators/migration-func.js";

export const migrateCommand = defineCommand({
	description: `Generates models for '${migrationConfig.npmPackageName}' library`,
	examples: [`kontent-generate-migration --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
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
		await generateMigrationModelsAsync({
			createFiles: true,
			environmentId: args.environmentId,
			managementApiKey: args.managementApiKey,
			addTimestamp: args.addTimestamp,
			moduleFileExtension: args.moduleFileExtension,
			outputDir: args.outputDir,
			managementBaseUrl: args.managementBaseUrl,
			disableComments: args.disableComments,
			formatOptions: undefined,
		} satisfies ExhaustiveConfig<GenerateMigrationModelsConfig>);
	},
});
