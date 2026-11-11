import { colorize } from "@kontent-ai/core-sdk/devkit";
import { SharedModels } from "@kontent-ai/management-sdk";
import { match, P } from "ts-pattern";
import type { ErrorData, OriginalManagementError } from "./core.models.js";
import { ModelGeneratorError, type ModelGeneratorErrorDetails } from "./model-generator.error.js";

export function logError(error: unknown): void {
	const errorData = extractErrorData(error);

	if (errorData.isUnknownError) {
		console.error(error);
	}

	if (errorData.requestData) {
		console.log(`${colorize("red", "Request data")}: ${errorData.requestData}`);
	}

	if (errorData.requestUrl) {
		console.log(`${colorize("red", "Request url")}: ${errorData.requestUrl}`);
	}

	console.error(`${colorize("red", "Error:")} ${errorData.message}`);

	if (errorData.reason) {
		console.error(`${colorize("red", "Reason:")} ${errorData.reason}`);
	}

	getDetailLines(errorData.details ?? {}).forEach((line) => {
		console.error(line);
	});

	if (errorData.cause !== undefined) {
		console.error(colorize("red", "Cause:"), errorData.cause);
	}
}

export function extractErrorData(error: unknown): ErrorData {
	return match(error)
		.returnType<ErrorData>()
		.with(P.instanceOf(SharedModels.ContentManagementBaseKontentError), (error) => {
			const originalError = error.originalError as OriginalManagementError | undefined;
			const validationErrorMessage = error.validationErrors.length
				? `: ${error.validationErrors.map((m) => m.message).join(", ")}`
				: "";

			return {
				message: `${error.message}${validationErrorMessage}`,
				requestData: originalError?.response?.config?.data,
				requestUrl: originalError?.response?.config?.url,
				error: error,
				isUnknownError: false,
				isMapiError: true,
			};
		})
		.with(P.instanceOf(ModelGeneratorError), (error) => {
			return {
				message: error.message,
				requestData: undefined,
				requestUrl: undefined,
				error: error,
				isUnknownError: false,
				isMapiError: false,
				reason: error.reason,
				details: error.details,
				cause: error.cause,
			};
		})
		.with(P.instanceOf(Error), (error) => {
			return {
				message: error.message,
				requestData: undefined,
				requestUrl: undefined,
				error: error,
				isUnknownError: true,
				isMapiError: false,
			};
		})
		.otherwise(() => {
			return {
				message: "Unknown error",
				requestData: undefined,
				requestUrl: undefined,
				error: error,
				isUnknownError: true,
				isMapiError: false,
			};
		});
}

function getDetailLines(details: ModelGeneratorErrorDetails): readonly string[] {
	return Object.entries(details)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${colorize("red", `${key}:`)} ${Array.isArray(value) ? value.join(", ") : String(value)}`);
}
