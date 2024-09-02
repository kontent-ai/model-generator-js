import { ModuleResolution } from '../../../core/index.js';
import { generateDeliveryModelsAsync } from '../../../generators/index.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function deliveryActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateDeliveryModelsAsync({
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        baseUrl: cliFetcher.getRequiredArgumentValue('managementApiUrl'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        outputDir: cliFetcher.getRequiredArgumentValue('outputDir'),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution: cliFetcher.getOptionalArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
