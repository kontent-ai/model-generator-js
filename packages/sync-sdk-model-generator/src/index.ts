export type { CaseType, ModuleFileExtension } from "@kontent-ai/model-generator-shared";
export {
	ModelGeneratorError,
	type ModelGeneratorErrorDetails,
	type ModelGeneratorErrorReason,
	resolveCase,
} from "@kontent-ai/model-generator-shared";
export { type GenerateSyncModelsConfig, generateSyncModelsAsync } from "./generators/sync/sync-func.js";
