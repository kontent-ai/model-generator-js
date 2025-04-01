import { generateDeliveryModelsAsync } from '../../lib/generators/delivery/delivery-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/delivery';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateDeliveryModelsAsync({
        // required
        environmentId: config.sampleEnv.environmentId,
        managementApiKey: config.sampleEnv.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        createFiles: true,
        addTimestamp: false,
        outputDir: outputDir, // only required when createFiles is true

        // optional
        fileResolvers: { contentType: 'camelCase', snippet: 'camelCase', taxonomy: 'camelCase' },
        nameResolvers: { contentType: 'pascalCase', snippet: 'pascalCase', taxonomy: 'pascalCase' },
        formatOptions: undefined,
        managementBaseUrl: undefined
    });
});
