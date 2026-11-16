import { commandOptions, defineCommand, type ExhaustiveConfig } from "@kontent-ai/model-generator-shared";
import { type GenerateItemsModelsConfig, generateItemsAsync } from "../generators/items/items-func.js";

export const itemsCommand = defineCommand({
	name: "items",
	description: "Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames.",
	examples: [
		`kontent-generate items --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x --${commandOptions.deliveryApiKey.name}=x --${commandOptions.apiMode.name}=preview --${commandOptions.contentTypes.name}=a,b,c`,
	],
	options: [
		commandOptions.environmentId,
		commandOptions.managementApiKey,
		commandOptions.deliveryApiKey,
		commandOptions.addTimestamp,
		commandOptions.moduleFileExtension,
		commandOptions.outputDir,
		commandOptions.managementBaseUrl,
		commandOptions.apiMode,
		commandOptions.contentTypes,
		commandOptions.deliveryBaseUrl,
		commandOptions.generateTypes,
		commandOptions.generateObjects,
		commandOptions.disableComments,
	],
	action: async (args) => {
		await generateItemsAsync({
			createFiles: true,
			environmentId: args.environmentId,
			managementApiKey: args.managementApiKey,
			deliveryApiKey: args.deliveryApiKey,
			addTimestamp: args.addTimestamp,
			moduleFileExtension: args.moduleFileExtension,
			outputDir: args.outputDir,
			managementBaseUrl: args.managementBaseUrl,
			deliveryBaseUrl: args.deliveryBaseUrl,
			apiMode: args.apiMode,
			filterByTypeCodenames: args.contentTypes,
			generateTypes: args.generateTypes,
			generateObjects: args.generateObjects,
			disableComments: args.disableComments,
			formatOptions: undefined,
		} satisfies ExhaustiveConfig<GenerateItemsModelsConfig>);
	},
});
