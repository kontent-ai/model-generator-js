#!/usr/bin/env node
const yargs = require('yargs');

import { generateModelsAsync } from '../generator';

const argv = yargs['argv'];

// user config
const projectId = argv.projectId;
const secureAccessKey = argv.secureAccessKey;
const addTimestamp = argv.addTimestamp;
const nameResolver = argv.nameResolver;
const includeCodename = argv.includeCodename;

if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}

const run = async () => {
    await generateModelsAsync({
        projectId: projectId,
        secureAccessKey: secureAccessKey,
        addTimestamp: addTimestamp === 'true' ? true : false,
        nameResolver: nameResolver,
        includeCodename: includeCodename === 'true' ? true : false,
        formatOptions: undefined
    });
};

run();
