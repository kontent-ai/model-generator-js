import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { coreConfig, itemsConfig } from '../../config.js';
import {
    importer as _importer,
    GeneratedFile,
    getDefaultModuleResolution,
    getFilenameFromPath,
    ModuleResolution
} from '../../core/index.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { fileManager as _fileManager } from '../../files/index.js';
import { itemsGenerator as _itemsGenerator } from './items.generator.js';

export interface GenerateItemsModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleResolution: ModuleResolution;

    readonly outputDir?: string;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateItemsAsync(config: GenerateItemsModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration')}' models\n`);

    const { itemFiles, moduleResolution, environmentInfo, codenameFiles } = await getFilesAsync(config);

    await createFilesAsync({
        moduleResolution,
        itemFiles,
        codenameFiles,
        outputDir: config.outputDir,
        formatOptions: config.formatOptions,
        addTimestamp: config.addTimestamp,
        environmentInfo
    });

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateItemsModelsConfig): Promise<{
    readonly itemFiles: readonly GeneratedFile[];
    readonly codenameFiles: readonly GeneratedFile[];
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

    const [items, types] = await Promise.all([kontentFetcher.getItemsAsync(), kontentFetcher.getTypesAsync()]);

    const itemsGenerator = _itemsGenerator({
        moduleResolution: config.moduleResolution,
        environmentData: {
            environment: environmentInfo,
            types: types,
            items: items
        }
    });

    return {
        moduleResolution,
        itemFiles: itemsGenerator.getItemFiles(),
        codenameFiles: itemsGenerator.getCodenameFiles(),
        environmentInfo
    };
}

async function createFilesAsync(data: {
    readonly itemFiles: readonly GeneratedFile[];
    readonly codenameFiles: readonly GeneratedFile[];
    readonly moduleResolution: ModuleResolution;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly addTimestamp: boolean;
}): Promise<void> {
    const fileManager = _fileManager({
        outputDir: data.outputDir,
        addTimestamp: data.addTimestamp,
        environmentInfo: data.environmentInfo,
        formatOptions: data.formatOptions
    });

    const importer = _importer(data.moduleResolution);

    await fileManager.createFilesAsync([
        ...data.itemFiles,
        ...data.codenameFiles,
        // items barrel file
        {
            filename: `${itemsConfig.itemsFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.itemFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        // codename barrel file
        {
            filename: `${itemsConfig.codenamesFolderName}/${coreConfig.barrelExportFilename}`,
            text: importer.getBarrelExportCode([
                ...data.codenameFiles.map((m) => {
                    return `./${getFilenameFromPath(m.filename)}`;
                })
            ])
        },
        // main barrel file
        {
            filename: coreConfig.barrelExportFilename,
            text: importer.getBarrelExportCode([`./${itemsConfig.itemsFolderName}/index`, `./${itemsConfig.codenamesFolderName}/index`])
        }
    ]);
}
