import { describe, expect, it } from "vitest";
import { mapFilename, mapName, resolveCase, resolvePropertyName } from "../../lib/core/resolvers.js";

type CaseResolverTest = {
	readonly text: string;
	readonly pascalCase: string;
	readonly camelCase: string;
};

describe("Resolvers - mapName", () => {
	it("Custom name should be used when function is used as arg (camelCase)", () => {
		expect(mapName((item) => `${item.name}custom`, "camelCase")({ name: "x" })).toStrictEqual("xcustom");
	});

	it("Custom name should be used when function is used as arg (pascalCase)", () => {
		expect(mapName((item) => `${item.name}Custom`, "pascalCase")({ name: "X" })).toStrictEqual("XCustom");
	});

	it("Prefix should be applied to name", () => {
		expect(mapName(() => "custom", "camelCase", { prefix: "x_" })({ name: "" })).toStrictEqual("x_custom");
	});

	it("Suffix should be applied to name", () => {
		expect(mapName(() => "custom", "camelCase", { suffix: "_x" })({ name: "" })).toStrictEqual("custom_x");
	});

	it("Default case should be used when resolver is undefined (camelCase)", () => {
		expect(mapName(undefined, "camelCase")({ name: "FirstName" })).toStrictEqual("firstName");
	});

	it("Default case should be used when resolver is undefined (pascalCase)", () => {
		expect(mapName(undefined, "pascalCase")({ name: "firstName" })).toStrictEqual("FirstName");
	});
});

describe("Resolvers - resolvePropertyName", () => {
	it("Property name should always be in camelCase", () => {
		expect(resolvePropertyName("FirstName")).toStrictEqual("firstName");
	});

	it("Property name should have special characters stripped", () => {
		expect(resolvePropertyName("#FirstName")).toStrictEqual("firstName");
		expect(resolvePropertyName(".FirstName")).toStrictEqual("firstName");
		expect(resolvePropertyName(" FirstName#?!")).toStrictEqual("firstName");
	});

	it("Property name should be prefixed with underscore when it starts with number characters", () => {
		expect(resolvePropertyName("1FirstName")).toStrictEqual("_1FirstName");
		expect(resolvePropertyName("111FirstName")).toStrictEqual("_111FirstName");
	});

	it("Random string should be generated when property name is empty", () => {
		expect(resolvePropertyName("").length).toBeGreaterThan(0);
		expect(resolvePropertyName("").length).toBeLessThan(15);
	});
});

describe("Resolvers - mapFilename", () => {
	it("File extension should be added", () => {
		expect(mapFilename((item) => `${item.codename}`)({ codename: "x" }, true)).toStrictEqual("x.ts");
	});

	it("File extension should not be added", () => {
		expect(mapFilename((item) => `${item.codename}`)({ codename: "x" }, false)).toStrictEqual("x");
	});

	it("Filename should be in camelCase", () => {
		expect(mapFilename((m) => m.codename)({ codename: "FirstName" }, true)).toStrictEqual("firstName.ts");
	});

	it("Custom name should be used instead of codename", () => {
		expect(mapFilename(() => "custom")({ codename: "x" }, false)).toStrictEqual("custom");
	});
});

describe("Case resolvers", () => {
	const testCases: readonly CaseResolverTest[] = [
		{
			text: "First Name",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "first_name",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "first-name",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "FirstName",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "FIRSTNAME",
			camelCase: "fIRSTNAME",
			pascalCase: "FIRSTNAME",
		},
		{
			text: "firstName",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "first@name",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
		{
			text: "first1name",
			camelCase: "first1Name",
			pascalCase: "First1Name",
		},
		{
			text: "first name@last",
			camelCase: "firstNameLast",
			pascalCase: "FirstNameLast",
		},
		{
			text: "✏️ first name ✏️ ",
			camelCase: "firstName",
			pascalCase: "FirstName",
		},
	];

	for (const testCase of testCases) {
		it("Should resolve to valid camel case format", () => {
			expect(resolveCase(testCase.text, "camelCase")).toStrictEqual(testCase.camelCase);
		});

		it("Should resolve to valid pascal case format", () => {
			expect(resolveCase(testCase.text, "pascalCase")).toStrictEqual(testCase.pascalCase);
		});
	}
});
