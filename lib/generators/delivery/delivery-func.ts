import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { defaultModuleResolution } from '../../config.js';
import { GeneratedSet, ModuleResolution } from '../../core/core.models.js';
import {
    ContentTypeFileNameResolver,
    ContentTypeNameResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetNameResolver,
    TaxonomyNameResolver,
    TaxonomyTypeFileNameResolver
} from '../../core/resolvers.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { deliveryContentTypeGenerator } from './delivery-content-type.generator.js';
import { deliveryTaxonomyGenerator } from './delivery-taxonomy.generator.js';

export interface GenerateDeliveryModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;

    readonly fileResolvers?: {
        readonly taxonomy?: TaxonomyTypeFileNameResolver;
        readonly contentType?: ContentTypeFileNameResolver;
        readonly snippet?: ContentTypeSnippetFileNameResolver;
    };

    readonly nameResolvers?: {
        readonly contentType?: ContentTypeNameResolver;
        readonly snippet?: ContentTypeSnippetNameResolver;
        readonly taxonomy?: TaxonomyNameResolver;
    };
}

export async function generateDeliveryModelsAsync(config: GenerateDeliveryModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);

    const { contentTypeFiles, snippetFiles, taxonomyFiles, moduleResolution, environmentInfo, systemFiles } = await getFilesAsync(config);

    const fileManager = _fileManager({
        outputDir: config.outputDir,
        addTimestamp: config.addTimestamp,
        environmentInfo: environmentInfo,
        formatOptions: config.formatOptions,
        moduleResolution: moduleResolution
    });

    await fileManager.createSetsAsync([contentTypeFiles, snippetFiles, taxonomyFiles, systemFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateDeliveryModelsConfig): Promise<{
    readonly contentTypeFiles: GeneratedSet;
    readonly snippetFiles: GeneratedSet;
    readonly taxonomyFiles: GeneratedSet;
    readonly systemFiles: GeneratedSet;
    readonly moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = config.moduleResolution ?? defaultModuleResolution;
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    const [taxonomies, types, snippets, languages, collections, workflows] = await Promise.all([
        kontentFetcher.getTaxonomiesAsync(),
        kontentFetcher.getTypesAsync(),
        kontentFetcher.getSnippetsAsync(),
        kontentFetcher.getLanguagesAsync(),
        kontentFetcher.getCollectionsAsync(),
        kontentFetcher.getWorkflowsAsync()
    ]);

    const deliveryGenerator = deliveryContentTypeGenerator({
        moduleResolution: moduleResolution,
        environmentData: {
            environment: environmentInfo,
            types,
            snippets,
            taxonomies,
            languages,
            collections,
            workflows
        },
        fileResolvers: config.fileResolvers,
        nameResolvers: config.nameResolvers
    });

    const { contentTypeFiles, snippetFiles } = deliveryGenerator.generateModels();

    const taxonomyFiles = deliveryTaxonomyGenerator({
        moduleResolution: moduleResolution,
        environmentData: {
            environment: environmentInfo,
            taxonomies: taxonomies
        },
        fileResolvers: config.fileResolvers,
        nameResolvers: config.nameResolvers
    }).generateTaxonomyTypes();

    return {
        contentTypeFiles,
        snippetFiles,
        taxonomyFiles,
        moduleResolution,
        environmentInfo,
        systemFiles: deliveryGenerator.getSystemFiles()
    };
}
