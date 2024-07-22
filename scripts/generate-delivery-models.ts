import * as dotenv from 'dotenv';
import { rmSync } from 'fs';
import { ModuleResolution, generateModelsAsync, handleError } from '../lib/index.js';
import chalk from 'chalk';

const outputDir: string = './sample';

const run = async () => {
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

    const environmentVar = 'ENVIRONMENT_ID';
    const moduleResolutionVar = 'MODULE_RESOLUTION';
    const apiKeyVar = 'API_KEY';

    const environmentId = process.env[environmentVar];
    const apiKey = process.env[apiKeyVar];
    const moduleResolution = process.env[moduleResolutionVar];

    if (!moduleResolutionVar) {
        throw Error(`Missing '${chalk.red(moduleResolutionVar)}' env variable`);
    }

    if (!environmentId) {
        throw Error(`Missing '${chalk.red(environmentVar)}' env variable`);
    }
    if (!apiKey) {
        throw Error(`Missing '${chalk.red(apiKeyVar)}' env variable`);
    }

    await generateModelsAsync({
        addTimestamp: false,
        environmentId: environmentId,
        apiKey: apiKey,
        moduleResolution: moduleResolution?.toLowerCase() === <ModuleResolution>'node' ? 'node' : 'nodeNext',
        sdkType: 'delivery',
        isEnterpriseSubscription: true,
        addEnvironmentInfo: true,
        outputDir: outputDir,
        sortConfig: {
            sortTaxonomyTerms: true
        }
    });
};

run().catch((err) => {
    handleError(err);
});
