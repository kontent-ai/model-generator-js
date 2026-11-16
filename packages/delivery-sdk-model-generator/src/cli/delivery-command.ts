import { commandOptions, defineCommand, type ExhaustiveConfig } from "@kontent-ai/model-generator-shared";
import { deliveryConfig } from "../config.js";
import { type GenerateDeliveryModelsConfig, generateDeliveryModelsAsync } from "../generators/delivery-func.js";

export const deliveryCommand = defineCommand({
	description: `Generates models for '${deliveryConfig.npmPackageName}' library`,
	examples: [`kontent-generate-delivery --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`],
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
		await generateDeliveryModelsAsync({
			createFiles: true,
			environmentId: args.environmentId,
			managementApiKey: args.managementApiKey,
			addTimestamp: args.addTimestamp,
			moduleFileExtension: args.moduleFileExtension,
			outputDir: args.outputDir,
			managementBaseUrl: args.managementBaseUrl,
			disableComments: args.disableComments,
			formatOptions: undefined,
			fileResolvers: undefined,
			nameResolvers: undefined,
		} satisfies ExhaustiveConfig<GenerateDeliveryModelsConfig>);
	},
});
