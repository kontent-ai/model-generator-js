import type { CliAction, GeneratedFile } from '../../lib/core/core.models.js';
import { getEnvironmentRequiredValue } from '../../scripts/utils/environment.utils.js';

export type SnapshotModelsTest = {
    readonly cliAction: CliAction;
    readonly folder: string;
    readonly getFilesAsync: () => Promise<readonly GeneratedFile[]>;
};

export const integrationEnv = {
    id: getEnvironmentRequiredValue('INTEGRATION_ENVIRONMENT_ID'),
    apiKey: getEnvironmentRequiredValue('INTEGRATION_MANAGEMENT_API_KEY')
} as const;
