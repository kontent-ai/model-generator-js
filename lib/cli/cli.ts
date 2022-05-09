#!/usr/bin/env node
const yargs = require('yargs');

import { generateModelsAsync } from '../generator';

const argv = yargs['argv'];

// user config
const projectId = argv.projectId;
const apiKey = argv.apiKey;
const addTimestamp = argv.addTimestamp;
const elementResolver = argv.elementResolver;
const contentTypeFileResolver = argv.contentTypeFileResolver;
const taxonomyTypeFileResolver = argv.taxonomyTypeFileResolver;
const contentTypeResolver = argv.contentTypeResolver;
const taxonomyTypeResolver = argv.taxonomyTypeResolver;
const sdkType = argv.sdkType;
const exportWebhooks = argv.exportWebhooks === true;
const exportWorkflows = argv.exportWorkflows === true;
const exportAssetFolders = argv.exportAssetFolders === true;
const exportCollections = argv.exportCollections === true;
const exportLanguages = argv.exportLanguages === true;
const exportRoles = argv.exportRoles === true;

if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}

const run = async () => {
    await generateModelsAsync({
        projectId: projectId,
        apiKey: apiKey,
        addTimestamp: addTimestamp === 'true' ? true : false,
        elementResolver: elementResolver,
        contentTypeFileResolver: contentTypeFileResolver,
        contentTypeResolver: contentTypeResolver,
        taxonomyTypeFileResolver: taxonomyTypeFileResolver,
        taxonomyTypeResolver: taxonomyTypeResolver,
        formatOptions: undefined,
        sdkType: sdkType ?? 'delivery',
        exportProjectSettings: {
            exportWebhooks: exportWebhooks ?? true,
            exportWorkflows: exportWorkflows ?? true,
            exportAssetFolders: exportAssetFolders ?? true,
            exportCollections: exportCollections ?? true,
            exportLanguages: exportLanguages ?? true,
            exportRoles: exportRoles ?? true,
        }
    });
};

run();
