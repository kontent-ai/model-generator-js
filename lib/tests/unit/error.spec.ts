import { describe, expect, it } from "vitest";
import { findRequired } from "../../core/core.utils.js";
import { extractErrorData } from "../../core/error.utils.js";
import { getImporter } from "../../core/importer.js";
import { ModelGeneratorError } from "../../core/model-generator.error.js";

describe("Error - ModelGeneratorError", () => {
	it("Should set name, message, reason, details and cause", () => {
		const cause = new Error("Original");
		const error = new ModelGeneratorError({
			message: "Something failed",
			reason: "invalidInput",
			details: { text: "abc" },
			cause,
		});

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(ModelGeneratorError);
		expect(error.name).toStrictEqual("ModelGeneratorError");
		expect(error.message).toStrictEqual("Something failed");
		expect(error.reason).toStrictEqual("invalidInput");
		expect(error.details).toStrictEqual({ text: "abc" });
		expect(error.cause).toBe(cause);
	});

	it("Should default details to an empty object and have no cause", () => {
		const error = new ModelGeneratorError({ message: "Something failed", reason: "invalidConfig" });

		expect(error.details).toStrictEqual({});
		expect("cause" in error).toStrictEqual(false);
	});
});

describe("Error - findRequired", () => {
	it("Should return the found item", () => {
		expect(findRequired([1, 2, 3], (m) => m === 2, { message: "Not found" })).toStrictEqual(2);
	});

	it("Should throw ModelGeneratorError with 'entityNotFound' reason and given details", () => {
		expect(() => findRequired([1, 2, 3], (m) => m === 4, { message: "Not found", details: { id: 4 } })).toThrow(
			expect.objectContaining({
				name: "ModelGeneratorError",
				message: "Not found",
				reason: "entityNotFound",
				details: { id: 4 },
			}),
		);
	});
});

describe("Error - thrown errors", () => {
	it("Importer should throw ModelGeneratorError for filename without extension", () => {
		expect(() => getImporter("js").getGeneratedFilename("")).toThrow(ModelGeneratorError);
	});
});

describe("Error - extractErrorData", () => {
	it("Should map ModelGeneratorError to error data with reason and details", () => {
		const error = new ModelGeneratorError({ message: "Missing", reason: "missingArgument", details: { argumentName: "apiKey" } });

		expect(extractErrorData(error)).toStrictEqual({
			message: "Missing",
			requestData: undefined,
			requestUrl: undefined,
			error,
			isUnknownError: false,
			isMapiError: false,
			reason: "missingArgument",
			details: { argumentName: "apiKey" },
			cause: undefined,
		});
	});

	it("Should treat plain errors as unknown", () => {
		expect(extractErrorData(new Error("Plain")).isUnknownError).toStrictEqual(true);
	});
});
