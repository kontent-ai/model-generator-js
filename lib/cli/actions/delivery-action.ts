import { ModuleResolution } from '../../core/core.models.js';
import { generateDeliveryModelsAsync } from '../../generators/delivery/delivery-func.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function deliveryActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateDeliveryModelsAsync({
        // required
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        // optional
        baseUrl: cliFetcher.getOptionalArgumentValue('baseUrl'),
        outputDir: cliFetcher.getOptionalArgumentValue('outputDir'),
        addTimestamp: cliFetcher.getBooleanArgumentValue('addTimestamp', false),
        moduleResolution: cliFetcher.getOptionalArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
