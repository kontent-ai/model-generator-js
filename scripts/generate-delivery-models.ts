import { generateModelsAsync } from '../dist/cjs/lib';
import * as dotenv from 'dotenv';
import { rmSync } from 'fs';

const outputDir: string = './sample';

const run = async () => {
    // needed to load .env environment to current process when run via package.json script
    dotenv.config({
        path: './.env'
    });

    // delete existing models
    console.log(`Deleting existing folder '${outputDir}'`)
    rmSync(outputDir, {
        recursive: true,
        force: true
    });

    console.log(`Folder '${outputDir}' deleted successfully`);

    const environmentVar = 'ENVIRONMENT_ID';
    const apiKeyVar = 'API_KEY';

    const environmentId = process.env[environmentVar];
    const apiKey = process.env[apiKeyVar];

    if (!environmentId) {
        throw Error(`Missing '${environmentVar}' env variable`);
    }
      if (!apiKey) {
          throw Error(`Missing '${apiKeyVar}' env variable`);
    }

    await generateModelsAsync({
        addTimestamp: false,
        environmentId: environmentId,
        apiKey: apiKey,
        sdkType: 'delivery',
        isEnterpriseSubscription: true,
        addEnvironmentInfo: true,
        outputDir: outputDir,
        sortConfig: {
            sortTaxonomyTerms: true
        }
    });
};

run();
