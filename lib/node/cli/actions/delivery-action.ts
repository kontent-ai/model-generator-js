import { ModuleResolution } from '../../../models.js';
import { generateDeliveryModelsAsync } from '../../../generator.js';
import { CliArgumentsFetcher } from '../cli.models.js';

export async function deliveryActionAsync(cliFetcher: CliArgumentsFetcher): Promise<void> {
    await generateDeliveryModelsAsync({
        environmentId: cliFetcher.getRequiredArgumentValue('environmentId'),
        managementApiUrl: cliFetcher.getRequiredArgumentValue('managementApiUrl'),
        apiKey: cliFetcher.getRequiredArgumentValue('apiKey'),
        outputDir: cliFetcher.getRequiredArgumentValue('outputDir'),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue('isEnterpriseSubscription', false),
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
        modelType: 'delivery',
        sortConfig: {
            sortTaxonomyTerms: cliFetcher.getBooleanArgumentValue('sortTaxonomyTerms', true)
        },
        moduleResolution:
            cliFetcher.getRequiredArgumentValue('moduleResolution') === <ModuleResolution>'node' ? 'node' : 'nodeNext'
    });
}
