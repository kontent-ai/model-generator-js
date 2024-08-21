import chalk from 'chalk';
import { GenerateDeliveryModelsConfig, ModuleResolution } from '../../models.js';
import { deliveryContentTypeGenerator } from './delivery-content-type.generator.js';
import { deliveryTaxonomyGenerator } from './delivery-taxonomy.generator.js';
import { fileProcessor as _fileProcessor } from '../../files/index.js';
import { parse } from 'path';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { coreConfig, deliveryConfig, GeneratedFile, getBarrelExportCode, toOutputDirPath } from '../../core/index.js';
import { Options } from 'prettier';

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

    await kontentFetcher.getEnvironmentInfoAsync();

    const taxonomies = await kontentFetcher.getTaxonomiesAsync();

    // create content type models
    const deliveryModels = deliveryContentTypeGenerator.generateModels({
        types: await kontentFetcher.getTypesAsync(),
        typeFolderName: contentTypesFolderName,
        taxonomyFolderName: taxonomiesFolderName,
        typeSnippetsFolderName: contentTypeSnippetsFolderName,
        taxonomies: taxonomies,
        snippets: await kontentFetcher.getSnippetsAsync(),
        addTimestamp: config.addTimestamp,
        addEnvironmentInfo: config.addEnvironmentInfo,
        elementResolver: config.elementResolver,
        contentTypeFileNameResolver: config.contentTypeFileResolver,
        contentTypeResolver: config.contentTypeResolver,
        taxonomyFileResolver: config.taxonomyTypeFileResolver,
        taxonomyResolver: config.taxonomyTypeResolver,
        contentTypeSnippetFileNameResolver: config.contentTypeSnippetFileResolver,
        contentTypeSnippetResolver: config.contentTypeSnippetResolver,
        moduleResolution: moduleResolution
    });

    // create taxonomy types
    const taxonomyFiles = deliveryTaxonomyGenerator.generateTaxonomyTypes({
        taxonomies: taxonomies,
        taxonomyFolderName: taxonomiesFolderName,
        addTimestamp: config.addTimestamp,
        fileResolver: config.taxonomyTypeFileResolver,
        taxonomyResolver: config.taxonomyTypeResolver
    });

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
        readonly formatOptions: Options | undefined;
    },
    folders: {
        readonly contentTypesFolderName: string;
        readonly contentTypeSnippetsFolderName: string;
        readonly taxonomiesFolderName: string;
    }
): Promise<void> {
    const fileProcessor = _fileProcessor(toOutputDirPath(config.outputDir));

    await fileProcessor.createFilesAsync(
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
