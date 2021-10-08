#!/usr/bin/env node
const yargs = require('yargs');

import { Generator } from './generator';

const argv = yargs['argv'];

// user config
const projectId = argv.projectId;
const secureAccessKey = argv.secureAccessKey;
const addTimestamp = argv.addTimestamp;
const nameResolver = argv.nameResolver;

if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}

// init & start generator
const generator = new Generator({
    projectId: projectId,
    secureAccessKey: secureAccessKey,
    addTimestamp: addTimestamp === 'true' ? true : false,
    nameResolver: nameResolver
});

const run = async () => {
    await generator.generateModelsAsync();
};

run();
