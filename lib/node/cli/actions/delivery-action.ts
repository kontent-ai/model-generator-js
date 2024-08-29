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
        addEnvironmentInfo: cliFetcher.getBooleanArgumentValue('addEnvironmentInfo', false),
        elementResolver: undefined,
        contentTypeFileResolver: undefined,
        contentTypeResolver: undefined,
        taxonomyTypeFileResolver: undefined,
        taxonomyTypeResolver: undefined,
        contentTypeSnippetFileResolver: undefined,
        contentTypeSnippetResolver: undefined,
        formatOptions: undefined,
        moduleResolution:
            cliFetcher.getRequiredArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
