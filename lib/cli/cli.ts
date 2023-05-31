#!/usr/bin/env node
import * as yargs from 'yargs';
import { generateModelsAsync } from '../generator';

const argv = yargs(process.argv.slice(2))
    .example(
        'kontent-generate --environmentId=xxx --apiKey=yyy',
        'Basic configuration to generate strongly typed models'
    )
    .alias('p', 'environmentId')
    .describe('p', 'environmentId')
    .alias('i', 'environmentId')
    .describe('i', 'environmentId')
    .alias('k', 'apiKey')
    .describe('k', 'Management API Key')
    .alias('o', 'outputDir')
    .describe('o', 'Directory where generated files will be created')
    .alias('a', 'addTimestamp')
    .describe('a', 'Indicates if timestamp should be generated')
    .alias('t', 'sdkType')
    .describe('t', 'Type of sdk for which models are generated. Available options are: delivery')
    .option('exportLanguages', {
        description: 'Indicates if languages are exported'
    })
    .option('exportCollections', {
        description: 'Indicates if collections are exported'
    })
    .option('exportAssetFolders', {
        description: 'Indicates if asset folders are exported'
    })
    .option('exportWorkflows', {
        description: 'Indicates if workflows are exported'
    })
    .option('exportWebhooks', {
        description: 'Indicates if webhooks are exported'
    })
    .option('taxonomyTypeResolver', {
        description: 'Name resolver for taxonomy type names. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('contentTypeResolver', {
        description: 'Name resolver for content type names. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('contentTypeSnippetResolver', {
        description:
            'Name resolver for content type snippet names. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('taxonomyTypeFileResolver', {
        description: 'Name resolver for taxonomy filenames. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('contentTypeFileResolver', {
        description: 'Name resolver for content type filenames. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('contentTypeSnippetFileResolver', {
        description:
            'Name resolver for content type snippet filenames. Available options are: camelCase, pascalCase, snakeCase'
    })
    .option('exportRoles', {
        description: 'Indicates if roles are exported. Only available for Enterprise subscription plans'
    })
    .option('isEnterpriseSubscription', {
        description: 'Indicates if enterprise subscription endpoint can be used to export data.'
    })
    .help('h')
    .alias('h', 'help').argv;

const run = async () => {
    const resolvedArgs = (await argv) as any;

    // user config
    const environmentId = resolvedArgs.environmentId;
    const apiKey = resolvedArgs.apiKey;
    const outputDir = resolvedArgs.outputDir;
    const addTimestamp = resolvedArgs.addTimestamp;
    const elementResolver = resolvedArgs.elementResolver;
    const contentTypeFileResolver = resolvedArgs.contentTypeFileResolver;
    const contentTypeSnippetFileResolver = resolvedArgs.contentTypeSnippetFileResolver;
    const taxonomyTypeFileResolver = resolvedArgs.taxonomyTypeFileResolver;
    const contentTypeResolver = resolvedArgs.contentTypeResolver;
    const taxonomyTypeResolver = resolvedArgs.taxonomyTypeResolver;
    const contentTypeSnippetResolver = resolvedArgs.contentTypeSnippetResolver;
    const sdkType = resolvedArgs.sdkType;
    const exportWebhooks = !resolvedArgs.exportWebhooks ? true :  resolvedArgs.exportWebhooks === 'true';
    const exportWorkflows =  !resolvedArgs.exportWorkflows ? true :  resolvedArgs.exportWorkflows === 'true';
    const exportAssetFolders =  !resolvedArgs.exportAssetFolders ? true :  resolvedArgs.exportAssetFolders === 'true';
    const exportCollections = !resolvedArgs.exportCollections ? true :  resolvedArgs.exportCollections === 'true';
    const exportLanguages =  !resolvedArgs.exportLanguages ? true :  resolvedArgs.exportLanguages === 'true';
    const exportRoles = !resolvedArgs.exportRoles ? true :  resolvedArgs.exportRoles === 'true';
    const isEnterpriseSubscription = !resolvedArgs.isEnterpriseSubscription ? true :  resolvedArgs.isEnterpriseSubscription === 'true';

    if (!environmentId) {
        throw Error(`Please provide environment id using 'environmentId' argument`);
    }

    await generateModelsAsync({
        environmentId: environmentId,
        apiKey: apiKey,
        outputDir: outputDir,
        isEnterpriseSubscription: isEnterpriseSubscription,
        addTimestamp: addTimestamp === 'true' ? true : false,
        elementResolver: elementResolver,
        contentTypeFileResolver: contentTypeFileResolver,
        contentTypeResolver: contentTypeResolver,
        taxonomyTypeFileResolver: taxonomyTypeFileResolver,
        taxonomyTypeResolver: taxonomyTypeResolver,
        contentTypeSnippetFileResolver: contentTypeSnippetFileResolver,
        contentTypeSnippetResolver: contentTypeSnippetResolver,
        formatOptions: undefined,
        sdkType: sdkType ?? 'delivery',
        exportProjectSettings: {
            exportWebhooks: exportWebhooks ?? true,
            exportWorkflows: exportWorkflows ?? true,
            exportAssetFolders: exportAssetFolders ?? true,
            exportCollections: exportCollections ?? true,
            exportLanguages: exportLanguages ?? true,
            exportRoles: exportRoles ?? true
        }
    });
};

run();
