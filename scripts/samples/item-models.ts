import chalk from 'chalk';
import * as dotenv from 'dotenv';
import { rmSync } from 'fs';
import { parseModuleFileExtension } from '../../lib/cli/arg.utils.js';
import { logError } from '../../lib/core/error.utils.js';
import { generateItemsAsync } from '../../lib/generators/items/items-func.js';
import { getEnvironmentOptionalValue, getEnvironmentRequiredValue } from '../utils/test.utils.js';

const outputDir: string = './sample/items';

try {
    // needed to load .env environment to current process when run via package.json script
    dotenv.config();

    // delete existing models
    console.log(`Deleting existing folder '${chalk.yellow(outputDir)}'`);
    rmSync(outputDir, {
        recursive: true,
        force: true
    });

    console.log(`Folder '${chalk.yellow(outputDir)}' deleted successfully`);

    const environmentId = getEnvironmentRequiredValue('ENVIRONMENT_ID');
    const apiKey = getEnvironmentRequiredValue('API_KEY');
    const deliveryApiKey = getEnvironmentOptionalValue('DELIVERY_API_KEY');
    const moduleFileExtension = parseModuleFileExtension(getEnvironmentRequiredValue('MODULE_EXTENSION'));

    await generateItemsAsync({
        addTimestamp: false,
        environmentId: environmentId,
        apiKey: apiKey,
        moduleFileExtension: moduleFileExtension,
        outputDir: outputDir,
        apiMode: 'default',
        deliveryApiKey: deliveryApiKey,
        filterByTypeCodenames: [],
        generateObjects: true,
        generateTypes: true
    });
} catch (error) {
    logError(error);
}
