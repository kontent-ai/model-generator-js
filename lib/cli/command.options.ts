import { environmentEntities } from "../core/core.models.js";
import { deliveryApiModeOptions, moduleFileExtensionOptions } from "./arg.utils.js";
import type { CommandOption, CommandOptionNames } from "./cli.models.js";

export const commandOptions: { [key in CommandOptionNames]: CommandOption } = {
	environmentId: { name: "environmentId", description: "Id of the environment", type: "string", isRequired: true },
	managementApiKey: { name: "managementApiKey", description: "Management API key", type: "string", isRequired: true },
	deliveryApiKey: { name: "deliveryApiKey", description: "Delivery API key", type: "string", isRequired: true },
	outputDir: {
		name: "outputDir",
		description: "Relative directory path where directory will be created",
		type: "string",
		isRequired: false,
	},
	addTimestamp: {
		name: "addTimestamp",
		description: "Indicates whether timestamp should be generated for every file",
		type: "boolean",
		isRequired: false,
	},
	moduleFileExtension: {
		name: "moduleFileExtension",
		description: `Module resolution for imports. One of: ${Object.values(moduleFileExtensionOptions).join(", ")}`,
		type: "string",
		isRequired: false,
	},
	apiMode: {
		name: "apiMode",
		description: `API mode for Delivery. ${Object.values(deliveryApiModeOptions).join(", ")}`,
		type: "string",
		isRequired: false,
	},
	contentTypes: {
		name: "contentTypes",
		description: "Comma separated list of content type codenames. If not provided, all items will be generated",
		type: "string",
		isRequired: false,
	},
	managementBaseUrl: { name: "managementBaseUrl", description: "Base URL for Management API", type: "string", isRequired: false },
	deliveryBaseUrl: { name: "deliveryBaseUrl", description: "Base URL for Delivery API", type: "string", isRequired: false },
	generateTypes: {
		name: "generateTypes",
		description: "Indicates if Typescript types representing data are generated",
		type: "boolean",
		isRequired: false,
	},
	generateObjects: {
		name: "generateObjects",
		description: "Indicates if objects (const variables) representing data are generated",
		type: "boolean",
		isRequired: false,
	},
	entities: {
		name: "entities",
		description: `Comma separated list of entities: ${environmentEntities.join(", ")}`,
		type: "string",
		isRequired: false,
	},
	help: { name: "help", description: "Shows help message", type: "boolean", isRequired: false },
	disableComments: { name: "disableComments", description: "Disables comments in generated files", type: "boolean", isRequired: false },
};
