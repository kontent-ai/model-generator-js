import { describe, expect, it } from "vitest";
import { defineCommand, parseCommandArgs, resolveCommand } from "../../cli/command.js";
import { commandOptions } from "../../cli/command.options.js";
import { ModelGeneratorError } from "../../core/model-generator.error.js";

describe("CLI - option parsing", () => {
	it("Should parse declared options into typed values", () => {
		const args = parseCommandArgs(
			[
				commandOptions.environmentId,
				commandOptions.deliveryApiKey,
				commandOptions.addTimestamp,
				commandOptions.generateTypes,
				commandOptions.contentTypes,
				commandOptions.moduleFileExtension,
				commandOptions.apiMode,
				commandOptions.entities,
			],
			{ environmentId: "x", addTimestamp: true, contentTypes: "a,b", entities: "languages,unknown,taxonomies", apiMode: "preview" },
		);

		expect(args).toStrictEqual({
			environmentId: "x",
			deliveryApiKey: undefined,
			addTimestamp: true,
			generateTypes: true,
			contentTypes: ["a", "b"],
			moduleFileExtension: "js",
			apiMode: "preview",
			entities: ["languages", "taxonomies"],
		});
	});

	it("Should parse boolean string values", () => {
		expect(parseCommandArgs([commandOptions.generateObjects], { generateObjects: "false" })).toStrictEqual({ generateObjects: false });
		expect(parseCommandArgs([commandOptions.disableComments], { disableComments: "TRUE" })).toStrictEqual({ disableComments: true });
	});

	it("Should fall back to defaults for invalid enum values", () => {
		expect(
			parseCommandArgs([commandOptions.moduleFileExtension, commandOptions.apiMode], { moduleFileExtension: "x", apiMode: "y" }),
		).toStrictEqual({
			moduleFileExtension: "js",
			apiMode: "default",
		});
	});

	it("Should throw 'missingArgument' when required option is missing", () => {
		expect(() => parseCommandArgs([commandOptions.environmentId], {})).toThrow(
			expect.objectContaining({ reason: "missingArgument", details: { argumentName: "environmentId" } }),
		);
	});
});

describe("CLI - command resolution", () => {
	const createCommand = (name: string | undefined) =>
		defineCommand({ name, description: "", examples: [], options: [commandOptions.environmentId], action: async () => {} });

	it("Should resolve command by name", () => {
		const commands = [createCommand("environment"), createCommand("items")];

		expect(resolveCommand(commands, "items")).toBe(commands[1]);
	});

	it("Should resolve default command when name does not match", () => {
		const commands = [createCommand(undefined)];

		expect(resolveCommand(commands, undefined)).toBe(commands[0]);
		expect(resolveCommand(commands, "other")).toBe(commands[0]);
	});

	it("Should throw 'unsupportedCommand' listing supported commands", () => {
		const resolve = () => resolveCommand([createCommand("environment"), createCommand("items")], "foo");

		expect(resolve).toThrow(ModelGeneratorError);
		expect(resolve).toThrow(
			expect.objectContaining({
				reason: "unsupportedCommand",
				details: { command: "foo", supportedCommands: ["environment", "items"] },
			}),
		);
	});

	it("Should pass parsed args to the action", async () => {
		const received: unknown[] = [];
		const command = defineCommand({
			name: "test",
			description: "",
			examples: [],
			options: [commandOptions.environmentId, commandOptions.addTimestamp],
			action: (args) => {
				received.push(args);
				return Promise.resolve();
			},
		});

		await command.runAsync({ environmentId: "x" });

		expect(received).toStrictEqual([{ environmentId: "x", addTimestamp: false }]);
	});
});
