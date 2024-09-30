import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { defaultModuleResolution } from '../../config.js';
import { GeneratedSet, ModuleResolution } from '../../core/core.models.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
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

    const fileManager = _fileManager({
        outputDir: config.outputDir,
        addTimestamp: config.addTimestamp,
        environmentInfo: environmentInfo,
        formatOptions: config.formatOptions,
        moduleResolution: moduleResolution
    });

    await fileManager.createSetsAsync([itemFiles, codenameFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateItemsModelsConfig): Promise<{
    readonly itemFiles: GeneratedSet;
    readonly codenameFiles: GeneratedSet;
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
