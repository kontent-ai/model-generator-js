import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { itemsGenerator as _itemsGenerator } from './items.generator.js';

export interface GenerateItemsModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleFileExtension: ModuleFileExtension;

    readonly outputDir?: string;
    readonly baseUrl?: string;
    readonly formatOptions?: Readonly<Options>;
}

export async function generateItemsAsync(config: GenerateItemsModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('migration')}' models\n`);

    const { itemFiles, environmentInfo, codenameFiles } = await getFilesAsync(config);

    const fileManager = _fileManager({
        ...config,
        environmentInfo: environmentInfo
    });

    await fileManager.createSetsAsync([itemFiles, codenameFiles]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateItemsModelsConfig): Promise<{
    readonly itemFiles: GeneratedSet;
    readonly codenameFiles: GeneratedSet;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await kontentFetcher.getEnvironmentInfoAsync();

    const [items, types] = await Promise.all([kontentFetcher.getItemsAsync(), kontentFetcher.getTypesAsync()]);

    const itemsGenerator = _itemsGenerator({
        environmentData: {
            environment: environmentInfo,
            types: types,
            items: items
        }
    });

    return {
        itemFiles: itemsGenerator.getItemFiles(),
        codenameFiles: itemsGenerator.getCodenameFiles(),
        environmentInfo
    };
}
