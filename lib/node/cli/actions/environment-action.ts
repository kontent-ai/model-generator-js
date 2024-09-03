import { ModuleResolution } from '../../../core/index.js';
import { generateEnvironmentModelsAsync } from '../../../generators/index.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function environmentActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateEnvironmentModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue('baseUrl'),
        outputDir: cliFetcher.getOptionalArgumentValue('outputDir'),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution: cliFetcher.getOptionalArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext',
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue('isEnterpriseSubscription', false)
    });
}
