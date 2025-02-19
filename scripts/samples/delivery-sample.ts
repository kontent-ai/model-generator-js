import { generateDeliveryModelsAsync } from '../../lib/generators/delivery/delivery-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/delivery';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateDeliveryModelsAsync({
        createFiles: true,
        addTimestamp: false,
        environmentId: config.environmentId,
        apiKey: config.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        outputDir: outputDir,
        fileResolvers: { contentType: 'camelCase', snippet: 'camelCase', taxonomy: 'camelCase' }
    });
});
