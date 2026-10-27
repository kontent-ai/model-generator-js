import { argumentsSetter, commandOptions } from "@kontent-ai/model-generator-shared";

export type CliAction = "environment" | "items";

export const cliArgs = argumentsSetter<CliAction>()
	.withCommand({
		name: "environment",
		description:
			"Generates strongly typed models representing all objects in the environment. This is useful for creating custom tools or scripts where you need to reference objects within your environment",
		examples: [
			`kontent-generate ${"environment" satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x`,
		],
		options: [
			commandOptions.environmentId,
			commandOptions.managementApiKey,
			commandOptions.addTimestamp,
			commandOptions.moduleFileExtension,
			commandOptions.outputDir,
			commandOptions.managementBaseUrl,
		],
	})
	.withCommand({
		name: "items",
		description: "Overview of all items in the environment and their ids/codenames as well as Type representing all item codenames.",
		examples: [
			`kontent-generate ${"items" satisfies CliAction} --${commandOptions.environmentId.name}=x --${commandOptions.managementApiKey.name}=x --${commandOptions.deliveryApiKey.name}=x --${commandOptions.apiMode.name}=preview --${commandOptions.contentTypes.name}=a,b,c`,
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
		],
	})
	.withOption(commandOptions.help);
