import { colorize } from "@kontent-ai/core-sdk/devkit";
import { environmentEntities } from "../core/core.models.js";
import { ModelGeneratorError } from "../core/model-generator.error.js";
import { isEnvironmentEntity } from "../core/type-guards.js";
import { deliveryApiModeOptions, moduleFileExtensionOptions, parseDeliveryApiMode, parseModuleFileExtension } from "./arg.utils.js";
import type { CommandOption, CommandOptionNames } from "./cli.models.js";

type OptionInfo<TName extends CommandOptionNames> = {
	readonly name: TName;
	readonly description: string;
};

function requiredStringOption<TName extends CommandOptionNames>(info: OptionInfo<TName>): CommandOption<TName, string> {
	return {
		...info,
		type: "string",
		isRequired: true,
		parse: (rawValue) => {
			if (!rawValue) {
				throw new ModelGeneratorError({
					message: `Missing '${colorize("yellow", info.name)}' argument value`,
					reason: "missingArgument",
					details: { argumentName: info.name },
				});
			}
			return rawValue;
		},
	};
}

function stringOption<TName extends CommandOptionNames, TValue>(
	info: OptionInfo<TName>,
	parse: (rawValue: string | undefined) => TValue,
): CommandOption<TName, TValue> {
	return { ...info, type: "string", isRequired: false, parse };
}

function optionalStringOption<TName extends CommandOptionNames>(info: OptionInfo<TName>): CommandOption<TName, string | undefined> {
	return stringOption(info, (rawValue) => rawValue);
}

function booleanOption<TName extends CommandOptionNames>(info: OptionInfo<TName>, defaultValue: boolean): CommandOption<TName, boolean> {
	return {
		...info,
		type: "boolean",
		isRequired: false,
		parse: (rawValue) => (rawValue ? rawValue.toLowerCase() === "true" : defaultValue),
	};
}

function parseArrayValue(rawValue: string | undefined): readonly string[] {
	return rawValue?.split(",") ?? [];
}

export const commandOptions = {
	environmentId: requiredStringOption({ name: "environmentId", description: "Id of the environment" }),
	managementApiKey: requiredStringOption({ name: "managementApiKey", description: "Management API key" }),
	deliveryApiKey: optionalStringOption({
		name: "deliveryApiKey",
		description: "Delivery API key. Required when 'apiMode' is 'preview' or 'secure'",
	}),
	outputDir: optionalStringOption({ name: "outputDir", description: "Relative directory path where directory will be created" }),
	addTimestamp: booleanOption(
		{ name: "addTimestamp", description: "Indicates whether timestamp should be generated for every file" },
		false,
	),
	moduleFileExtension: stringOption(
		{
			name: "moduleFileExtension",
			description: `Module resolution for imports. One of: ${Object.values(moduleFileExtensionOptions).join(", ")}`,
		},
		parseModuleFileExtension,
	),
	apiMode: stringOption(
		{ name: "apiMode", description: `API mode for Delivery. ${Object.values(deliveryApiModeOptions).join(", ")}` },
		parseDeliveryApiMode,
	),
	contentTypes: stringOption(
		{
			name: "contentTypes",
			description: "Comma separated list of content type codenames. If not provided, all items will be generated",
		},
		parseArrayValue,
	),
	managementBaseUrl: optionalStringOption({ name: "managementBaseUrl", description: "Base URL for Management API" }),
	deliveryBaseUrl: optionalStringOption({ name: "deliveryBaseUrl", description: "Base URL for Delivery API" }),
	generateTypes: booleanOption(
		{ name: "generateTypes", description: "Indicates if Typescript types representing data are generated" },
		true,
	),
	generateObjects: booleanOption(
		{ name: "generateObjects", description: "Indicates if objects (const variables) representing data are generated" },
		true,
	),
	entities: stringOption(
		{ name: "entities", description: `Comma separated list of entities: ${environmentEntities.join(", ")}` },
		(rawValue) => parseArrayValue(rawValue).filter(isEnvironmentEntity),
	),
	help: booleanOption({ name: "help", description: "Shows help message" }, false),
	disableComments: booleanOption({ name: "disableComments", description: "Disables comments in generated files" }, false),
} as const satisfies { readonly [TName in CommandOptionNames]: CommandOption<TName> };
