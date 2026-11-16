import { commandOptions, defineCommand, type ExhaustiveConfig } from "@kontent-ai/model-generator-shared";
import { type GenerateEnvironmentModelsConfig, generateEnvironmentModelsAsync } from "../generators/environment/environment-func.js";

export const environmentCommand = defineCommand({
	name: "environment",
	description:
		"Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment",
	examples: [`kontent-generate environment --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
	options: [
		commandOptions.environmentId,
		commandOptions.managementApiKey,
		commandOptions.addTimestamp,
		commandOptions.moduleFileExtension,
		commandOptions.outputDir,
		commandOptions.managementBaseUrl,
		commandOptions.entities,
		commandOptions.disableComments,
	],
	action: async (args) => {
		await generateEnvironmentModelsAsync({
			createFiles: true,
			environmentId: args.environmentId,
			managementApiKey: args.managementApiKey,
			addTimestamp: args.addTimestamp,
			moduleFileExtension: args.moduleFileExtension,
			outputDir: args.outputDir,
			managementBaseUrl: args.managementBaseUrl,
			entities: args.entities,
			disableComments: args.disableComments,
			formatOptions: undefined,
		} satisfies ExhaustiveConfig<GenerateEnvironmentModelsConfig>);
	},
});
