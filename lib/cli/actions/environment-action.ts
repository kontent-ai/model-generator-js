import { generateEnvironmentModelsAsync } from '../../generators/environment/environment-func.js';
import { parseModuleFileExtension } from '../arg.utils.js';
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
        moduleFileExtension: parseModuleFileExtension(cliFetcher.getOptionalArgumentValue('moduleFileExtension')),
        isEnterpriseSubscription: cliFetcher.getBooleanArgumentValue('isEnterpriseSubscription', false)
    });
}
