export type ModelGeneratorErrorReason =
	| "missingArgument"
	| "missingEnvironmentVariable"
	| "unsupportedCommand"
	| "invalidConfig"
	| "entityNotFound"
	| "missingEnvironmentEntities"
	| "unsupportedElementType"
	| "invalidInput";

export type ModelGeneratorErrorDetails = Readonly<Record<string, string | number | boolean | readonly string[] | undefined>>;

export interface ModelGeneratorErrorData {
	readonly message: string;
	readonly reason: ModelGeneratorErrorReason;
	readonly details?: ModelGeneratorErrorDetails;
	readonly cause?: unknown;
}

/**
 * Error thrown by the model generators. Carries a `reason` and structured `details` useful for debugging.
 */
export class ModelGeneratorError extends Error {
	override readonly name = "ModelGeneratorError";
	readonly reason: ModelGeneratorErrorReason;
	readonly details: ModelGeneratorErrorDetails;

	constructor(data: ModelGeneratorErrorData) {
		super(data.message, data.cause === undefined ? undefined : { cause: data.cause });
		this.reason = data.reason;
		this.details = data.details ?? {};
	}
}
