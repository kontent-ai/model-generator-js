import { ModuleResolution } from '../../../core/index.js';
import { generateEnvironmentModelsAsync } from '../../../generators/index.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateEnvironmentModelsAsync({
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        baseUrl: cliFetcher.getRequiredArgumentValue('managementApiUrl'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        outputDir: cliFetcher.getRequiredArgumentValue('outputDir'),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue('isEnterpriseSubscription', false),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution: cliFetcher.getOptionalArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
