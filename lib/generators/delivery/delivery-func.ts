import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { coreConfig, deliveryConfig } from '../../config.js';
import { GeneratedFile, ModuleResolution } from '../../core/core.models.js';
import { getDefaultModuleResolution, getFilenameFromPath } from '../../core/core.utils.js';
import { importer as _importer } from '../../core/importer.js';
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

    await createFilesAsync(
        {
            contentTypeFiles,
            snippetFiles,
            taxonomyFiles,
            environmentInfo,
            systemFiles
        },
        {
            formatOptions: config.formatOptions,
            moduleResolution: moduleResolution,
            outputDir: config.outputDir,
            addTimestamp: config.addTimestamp
        }
    );

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateDeliveryModelsConfig): Promise<{
    readonly contentTypeFiles: readonly GeneratedFile[];
    readonly snippetFiles: readonly GeneratedFile[];
    readonly taxonomyFiles: readonly GeneratedFile[];
    readonly systemFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const moduleResolution: ModuleResolution = getDefaultModuleResolution(config.moduleResolution);
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

async function createFilesAsync(
    data: {
        readonly systemFiles: readonly GeneratedFile[];
        readonly contentTypeFiles: readonly GeneratedFile[];
        readonly snippetFiles: readonly GeneratedFile[];
        readonly taxonomyFiles: readonly GeneratedFile[];
        readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    },
    config: {
        readonly addTimestamp: boolean;
        readonly outputDir: string | undefined;
        readonly moduleResolution: ModuleResolution;
        readonly formatOptions: Readonly<Options> | undefined;
    }
): Promise<void> {
    const fileManager = _fileManager({
        outputDir: config.outputDir,
        addTimestamp: config.addTimestamp,
        environmentInfo: data.environmentInfo,
        formatOptions: config.formatOptions
    });

    const importer = _importer(config.moduleResolution);

    await fileManager.createFilesAsync([
        ...data.contentTypeFiles,
        ...data.snippetFiles,
        ...data.taxonomyFiles,
        ...data.systemFiles,
        // barrel files
        {
            filename: `${deliveryConfig.systemTypesFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.systemFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        {
            filename: `${deliveryConfig.contentTypesFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.contentTypeFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        {
            filename: `${deliveryConfig.contentTypeSnippetsFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.snippetFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        {
            filename: `${deliveryConfig.taxonomiesFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.taxonomyFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        {
            filename: coreConfig.barrelExportFilename,
            text: importer.getBarrelExportCode([
                `./${deliveryConfig.contentTypesFolderName}/index`,
                `./${deliveryConfig.contentTypeSnippetsFolderName}/index`,
                `./${deliveryConfig.taxonomiesFolderName}/index`,
                `./${deliveryConfig.systemTypesFolderName}/index`
            ])
        }
    ]);
}
