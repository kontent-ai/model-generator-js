import chalk from 'chalk';
import { GenerateDeliveryModelsConfig, ModuleResolution } from '../../models.js';
import { deliveryContentTypeGenerator } from '../../generators/delivery/delivery-content-type.generator.js';
import { deliveryTaxonomyGenerator } from '../../generators/delivery/delivery-taxonomy.generator.js';
import { commonHelper } from '../../common-helper.js';
import { parse } from 'path';
import { fileHelper } from '../../file-helper.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';

export async function generateDeliveryModelsAsync(config: GenerateDeliveryModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;

    const contentTypesFolderName: string = `content-types/`;
    const contentTypeSnippetsFolderName: string = `content-type-snippets/`;
    const taxonomiesFolderName: string = `taxonomies/`;

    const contentTypesFolderPath: string = `${outputDir}${contentTypesFolderName}`;
    const contentTypeSnippetsFolderPath: string = `${outputDir}${contentTypeSnippetsFolderName}`;
    const taxonomiesFolderPath: string = `${outputDir}${taxonomiesFolderName}`;

    // prepare directories
    fileHelper.createDir(contentTypesFolderPath);
    fileHelper.createDir(contentTypeSnippetsFolderPath);
    fileHelper.createDir(taxonomiesFolderPath);

    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    await kontentFetcher.getEnvironmentInfoAsync();

    const types = await kontentFetcher.getTypesAsync();
    const snippets = await kontentFetcher.getSnippetsAsync();
    const taxonomies = await kontentFetcher.getTaxonomiesAsync();

    // create content type models
    const deliveryModels = deliveryContentTypeGenerator.generateModels({
        outputDir: outputDir,
        types: types,
        typeFolderName: contentTypesFolderName,
        taxonomyFolderName: taxonomiesFolderName,
        typeSnippetsFolderName: contentTypeSnippetsFolderName,
        taxonomies: taxonomies,
        snippets: snippets,
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
        outputDir: outputDir,
        taxonomyFolderName: taxonomiesFolderName,
        addTimestamp: config.addTimestamp,
        fileResolver: config.taxonomyTypeFileResolver,
        taxonomyResolver: config.taxonomyTypeResolver
    });

    // create barrel export
    const barrelExportFilename: string = 'index.ts';

    // content types
    for (const file of deliveryModels.contentTypeFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const contentTypeBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...deliveryModels.contentTypeFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const contentTypeBarrelExportPath: string = `${contentTypesFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(contentTypeBarrelCode, contentTypeBarrelExportPath, config.formatOptions);

    // content type snippets
    for (const file of deliveryModels.snippetFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const contentTypeSnippetsBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...deliveryModels.snippetFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const contentTypeSnippetsBarrelExportPath: string = `${contentTypeSnippetsFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(
        contentTypeSnippetsBarrelCode,
        contentTypeSnippetsBarrelExportPath,
        config.formatOptions
    );

    // taxonomies
    for (const file of taxonomyFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const taxonomiesBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...taxonomyFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    const taxonomiesBarrelExportPath: string = `${taxonomiesFolderPath}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(taxonomiesBarrelCode, taxonomiesBarrelExportPath, config.formatOptions);

    // main barrel
    const mainBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            `./${contentTypesFolderName}index`,
            `./${contentTypeSnippetsFolderName}index`,
            `./${taxonomiesFolderName}index`
        ]
    });
    const mainBarrelExportPath: string = `${outputDir}${barrelExportFilename}`;
    await fileHelper.createFileOnFsAsync(mainBarrelCode, mainBarrelExportPath, config.formatOptions);

    console.log(chalk.green(`\nCompleted`));
}
