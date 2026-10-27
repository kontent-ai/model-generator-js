import type { GeneratedFile } from "../core/core.models.js";
import { getEnvironmentRequiredValue, loadMonorepoEnvFile } from "../dev/environment.utils.js";

loadMonorepoEnvFile();

export type SnapshotModelsTest = {
	readonly cliAction: string;
	readonly folder: string;
	readonly getFilesAsync: () => Promise<readonly GeneratedFile[]>;
};

export const integrationEnv = {
	id: getEnvironmentRequiredValue("INTEGRATION_ENVIRONMENT_ID"),
	apiKey: getEnvironmentRequiredValue("INTEGRATION_MANAGEMENT_API_KEY"),
} as const;
