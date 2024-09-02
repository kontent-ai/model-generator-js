import chalk from 'chalk';
import { deliveryContentTypeGenerator } from './delivery-content-type.generator.js';
import { deliveryTaxonomyGenerator } from './delivery-taxonomy.generator.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import {
    ContentTypeFileNameResolver,
    ContentTypeNameResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetNameResolver,
    coreConfig,
    deliveryConfig,
    GeneratorElementResolver,
    GeneratedFile,
    getBarrelExportCode,
    ModuleResolution,
    TaxonomyNameResolver,
    TaxonomyTypeFileNameResolver,
    getDefaultModuleResolution,
    getFilenameFromPath
} from '../../core/index.js';
import { Options } from 'prettier';
import { EnvironmentModels } from '@kontent-ai/management-sdk';

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
        readonly element?: GeneratorElementResolver;
    };
}

export async function generateDeliveryModelsAsync(config: GenerateDeliveryModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);

    const { contentTypeFiles, snippetFiles, taxonomyFiles, moduleResolution, environmentInfo } = await getFilesAsync(config);

    await createFilesAsync(
        {
            contentTypeFiles,
            snippetFiles,
            taxonomyFiles,
            environmentInfo
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
    const taxonomies = await kontentFetcher.getTaxonomiesAsync();

    const { contentTypeFiles, snippetFiles } = deliveryContentTypeGenerator({
        moduleResolution: moduleResolution,
        environmentData: {
            environment: environmentInfo,
            types: await kontentFetcher.getTypesAsync(),
            snippets: await kontentFetcher.getSnippetsAsync(),
            taxonomies: taxonomies
        },
        fileResolvers: config.fileResolvers,
        nameResolvers: config.nameResolvers
    }).generateModels();

    const taxonomyFiles = deliveryTaxonomyGenerator({
        moduleResolution: moduleResolution,
        environmentData: {
            environment: await kontentFetcher.getEnvironmentInfoAsync(),
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
        environmentInfo
    };
}

async function createFilesAsync(
    data: {
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

    await fileManager.createFilesAsync([
        ...data.contentTypeFiles,
        ...data.snippetFiles,
        ...data.taxonomyFiles,
        // barrel files
        {
            filename: `${deliveryConfig.contentTypesFolderName}/${coreConfig.barrelExportFilename}`,
            text: getBarrelExportCode({
                moduleResolution: config.moduleResolution,
                filenames: [
                    ...data.contentTypeFiles.map((m) => {
                        return `./${getFilenameFromPath(m.filename)}`;
                    })
                ]
            })
        },
        {
            filename: `${deliveryConfig.contentTypeSnippetsFolderName}/${coreConfig.barrelExportFilename}`,
            text: getBarrelExportCode({
                moduleResolution: config.moduleResolution,
                filenames: [
                    ...data.snippetFiles.map((m) => {
                        return `./${getFilenameFromPath(m.filename)}`;
                    })
                ]
            })
        },
        {
            filename: `${deliveryConfig.taxonomiesFolderName}/${coreConfig.barrelExportFilename}`,
            text: getBarrelExportCode({
                moduleResolution: config.moduleResolution,
                filenames: [
                    ...data.taxonomyFiles.map((m) => {
                        return `./${getFilenameFromPath(m.filename)}`;
                    })
                ]
            })
        },
        {
            filename: coreConfig.barrelExportFilename,
            text: getBarrelExportCode({
                moduleResolution: config.moduleResolution,
                filenames: [
                    `./${deliveryConfig.contentTypesFolderName}/index`,
                    `./${deliveryConfig.contentTypeSnippetsFolderName}/index`,
                    `./${deliveryConfig.taxonomiesFolderName}/index`
                ]
            })
        }
    ]);
}
