import chalk from 'chalk';
import * as dotenv from 'dotenv';
import { rmSync } from 'fs';
import { ModuleResolution, generateItemsAsync, handleError } from '../../lib/index.js';
import { getEnvironmentRequiredValue } from '../utils/test.utils.js';

const outputDir: string = './sample/items';

try {
    // needed to load .env environment to current process when run via package.json script
    dotenv.config({
        path: './.env'
    });

    // delete existing models
    console.log(`Deleting existing folder '${chalk.yellow(outputDir)}'`);
    rmSync(outputDir, {
        recursive: true,
        force: true
    });

    console.log(`Folder '${chalk.yellow(outputDir)}' deleted successfully`);

    const environmentId = getEnvironmentRequiredValue('ENVIRONMENT_ID');
    const apiKey = getEnvironmentRequiredValue('API_KEY');
    const moduleResolution = getEnvironmentRequiredValue('MODULE_RESOLUTION');

    await generateItemsAsync({
        addTimestamp: false,
        environmentId: environmentId,
        apiKey: apiKey,
        moduleResolution: moduleResolution?.toLowerCase() === <ModuleResolution>'node' ? 'node' : 'nodeNext',
        outputDir: outputDir
    });
} catch (error) {
    handleError(error);
}
