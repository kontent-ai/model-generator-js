import { generateItemsAsync } from '../../lib/generators/items/items-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/items';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateItemsAsync({
        createFiles: true,
        addTimestamp: false,
        environmentId: config.environmentId,
        apiKey: config.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        outputDir: outputDir,
        apiMode: 'default',
        deliveryApiKey: config.deliveryApiKey,
        filterByTypeCodenames: [],
        generateObjects: true,
        generateTypes: true
    });
});
