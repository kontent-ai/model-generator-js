import chalk from 'chalk';
import { deliveryContentTypeGenerator } from './delivery-content-type.generator.js';
import { deliveryTaxonomyGenerator } from './delivery-taxonomy.generator.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { parse } from 'path';
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
    toOutputDirPath
} from '../../core/index.js';
import { Options } from 'prettier';

export interface GenerateDeliveryModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly addEnvironmentInfo: boolean;
    readonly apiKey: string;

    readonly moduleResolution?: ModuleResolution;
    readonly baseUrl?: string;
    readonly outputDir?: string;
    readonly contentTypeFileResolver?: ContentTypeFileNameResolver;
    readonly contentTypeSnippetFileResolver?: ContentTypeSnippetFileNameResolver;
    readonly taxonomyTypeFileResolver?: TaxonomyTypeFileNameResolver;
    readonly contentTypeResolver?: ContentTypeNameResolver;
    readonly contentTypeSnippetResolver?: ContentTypeSnippetNameResolver;
    readonly taxonomyTypeResolver?: TaxonomyNameResolver;
    readonly elementResolver?: GeneratorElementResolver;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateDeliveryModelsAsync(config: GenerateDeliveryModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);
    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';

    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const contentTypesFolderName: string = deliveryConfig.contentTypesFolderName;
    const contentTypeSnippetsFolderName: string = deliveryConfig.contentTypeSnippetsFolderName;
    const taxonomiesFolderName: string = deliveryConfig.taxonomiesFolderName;

    const environment = await kontentFetcher.getEnvironmentInfoAsync();

    const taxonomies = await kontentFetcher.getTaxonomiesAsync();

    // create content type models
    const deliveryModels = deliveryContentTypeGenerator({
        addTimestamp: config.addTimestamp,
        addEnvironmentInfo: config.addEnvironmentInfo,
        moduleResolution: moduleResolution,
        environmentData: {
            environment: environment,
            types: await kontentFetcher.getTypesAsync(),
            snippets: await kontentFetcher.getSnippetsAsync(),
            taxonomies: taxonomies
        },
        folders: {
            typeFolderName: contentTypesFolderName,
            taxonomyFolderName: taxonomiesFolderName,
            typeSnippetsFolderName: contentTypeSnippetsFolderName
        },
        fileResolvers: {
            taxonomyFileResolver: config.taxonomyTypeFileResolver,
            contentTypeFileResolver: config.contentTypeFileResolver,
            contentTypeSnippetFileResolver: config.contentTypeSnippetFileResolver
        },
        nameResolvers: {
            elementNameResolver: config.elementResolver,
            contentTypeNameResolver: config.contentTypeResolver,
            taxonomyNameResolver: config.taxonomyTypeResolver,
            snippetNameResolver: config.contentTypeSnippetResolver
        }
    }).generateModels();

    // create taxonomy types
    const taxonomyFiles = deliveryTaxonomyGenerator({
        addTimestamp: config.addTimestamp,
        moduleResolution: moduleResolution,
        environmentData: {
            environment: await kontentFetcher.getEnvironmentInfoAsync(),
            taxonomies: taxonomies
        },
        fileResolvers: {
            taxonomyFilenameResolver: config.taxonomyTypeFileResolver
        },
        folders: {
            taxonomyFolderName: taxonomiesFolderName
        },
        nameResolvers: {
            taxonomyNameResolver: config.taxonomyTypeResolver
        }
    }).generateTaxonomyTypes();

    await createDeliveryFilesAsync(
        {
            contentTypeFiles: deliveryModels.contentTypeFiles,
            snippetFiles: deliveryModels.snippetFiles,
            taxonomyFiles: taxonomyFiles
        },
        {
            formatOptions: config.formatOptions,
            moduleResolution: moduleResolution,
            outputDir: config.outputDir
        },
        {
            contentTypesFolderName,
            contentTypeSnippetsFolderName,
            taxonomiesFolderName
        }
    );

    console.log(chalk.green(`\nCompleted`));
}

async function createDeliveryFilesAsync(
    data: {
        readonly contentTypeFiles: readonly GeneratedFile[];
        readonly snippetFiles: readonly GeneratedFile[];
        readonly taxonomyFiles: readonly GeneratedFile[];
    },
    config: {
        readonly outputDir: string | undefined;
        readonly moduleResolution: ModuleResolution;
        readonly formatOptions: Readonly<Options> | undefined;
    },
    folders: {
        readonly contentTypesFolderName: string;
        readonly contentTypeSnippetsFolderName: string;
        readonly taxonomiesFolderName: string;
    }
): Promise<void> {
    const fileManager = _fileManager(toOutputDirPath(config.outputDir));

    await fileManager.createFilesAsync(
        [
            ...data.contentTypeFiles,
            ...data.snippetFiles,
            ...data.taxonomyFiles,
            // barrel files
            {
                filename: `${folders.contentTypesFolderName}/${coreConfig.barrelExportFilename}`,
                text: getBarrelExportCode({
                    moduleResolution: config.moduleResolution,
                    filenames: [
                        ...data.contentTypeFiles.map((m) => {
                            const path = parse(m.filename);
                            return `./${path.name}`;
                        })
                    ]
                })
            },
            {
                filename: `${folders.contentTypeSnippetsFolderName}/${coreConfig.barrelExportFilename}`,
                text: getBarrelExportCode({
                    moduleResolution: config.moduleResolution,
                    filenames: [
                        ...data.snippetFiles.map((m) => {
                            const path = parse(m.filename);
                            return `./${path.name}`;
                        })
                    ]
                })
            },
            {
                filename: `${folders.taxonomiesFolderName}/${coreConfig.barrelExportFilename}`,
                text: getBarrelExportCode({
                    moduleResolution: config.moduleResolution,
                    filenames: [
                        ...data.taxonomyFiles.map((m) => {
                            const path = parse(m.filename);
                            return `./${path.name}`;
                        })
                    ]
                })
            },
            {
                filename: coreConfig.barrelExportFilename,
                text: getBarrelExportCode({
                    moduleResolution: config.moduleResolution,
                    filenames: [
                        `./${folders.contentTypesFolderName}/index`,
                        `./${folders.contentTypeSnippetsFolderName}/index`,
                        `./${folders.taxonomiesFolderName}/index`
                    ]
                })
            }
        ],
        config.formatOptions
    );
}
