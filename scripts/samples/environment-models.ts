import chalk from 'chalk';
import * as dotenv from 'dotenv';
import { rmSync } from 'fs';
import { parseModuleFileExtension } from '../../lib/cli/arg.utils.js';
import { logError } from '../../lib/core/error.utils.js';
import { generateEnvironmentModelsAsync } from '../../lib/generators/environment/environment-func.js';
import { getEnvironmentRequiredValue } from '../utils/test.utils.js';

const outputDir: string = './sample/environment';

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
    const moduleFileExtension = parseModuleFileExtension(getEnvironmentRequiredValue('MODULE_EXTENSION'));
    await generateEnvironmentModelsAsync({
        addTimestamp: false,
        environmentId: environmentId,
        apiKey: apiKey,
        moduleFileExtension: moduleFileExtension,
        isEnterpriseSubscription: true,
        outputDir: outputDir
    });
} catch (error) {
    logError(error);
}
