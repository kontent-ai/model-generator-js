import { generateMigrationModelsAsync } from '../../lib/generators/migration/migration-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/migration';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateMigrationModelsAsync({
        addTimestamp: false,
        environmentId: config.environmentId,
        apiKey: config.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        outputDir: outputDir
    });
});
