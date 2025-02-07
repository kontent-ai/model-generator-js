import { generateEnvironmentModelsAsync } from '../../lib/generators/environment/environment-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/environment';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateEnvironmentModelsAsync({
        addTimestamp: false,
        environmentId: config.environmentId,
        apiKey: config.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        isEnterpriseSubscription: true,
        outputDir: outputDir
    });
});
