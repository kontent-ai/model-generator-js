import { ModuleResolution } from '../../../core/index.js';
import { generateProjectModelsAsync } from '../../../generators/index.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function projectActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateProjectModelsAsync({
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        baseUrl: cliFetcher.getRequiredArgumentValue('managementApiUrl'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        outputDir: cliFetcher.getRequiredArgumentValue('outputDir'),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue('isEnterpriseSubscription', false),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution:
            cliFetcher.getRequiredArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
