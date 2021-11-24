#!/usr/bin/env node
const yargs = require('yargs');

import { generateModelsAsync } from '../generator';

const argv = yargs['argv'];

// user config
const projectId = argv.projectId;
const secureAccessKey = argv.secureAccessKey;
const addTimestamp = argv.addTimestamp;
const elementResolver = argv.elementResolver;
const fileResolver = argv.fileResolver;
const sdkType = argv.sdkType;

if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}

const run = async () => {
    await generateModelsAsync({
        projectId: projectId,
        secureAccessKey: secureAccessKey,
        addTimestamp: addTimestamp === 'true' ? true : false,
        elementResolver: elementResolver,
        fileResolver: fileResolver,
        formatOptions: undefined,
        sdkType: sdkType ?? 'delivery'
    });
};

run();
