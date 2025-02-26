import { generateMigrationModelsAsync } from '../../lib/generators/migration/migration-func.js';
import { deleteFolderRecursive, runScriptAsync } from '../utils/script.utils.js';

const outputDir: string = './sample/migration';

await runScriptAsync(async (config) => {
    deleteFolderRecursive(outputDir);

    await generateMigrationModelsAsync({
        createFiles: true,
        addTimestamp: false,
        environmentId: config.sampleEnv.environmentId,
        apiKey: config.sampleEnv.managementApiKey,
        moduleFileExtension: config.moduleFileExtension,
        outputDir: outputDir
    });
});
