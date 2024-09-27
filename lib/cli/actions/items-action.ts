import { ModuleResolution } from '../../core/core.models.js';
import { generateItemsAsync } from '../../generators/items/items-func.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function itemsActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateItemsAsync({
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
