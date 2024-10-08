import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { Options } from 'prettier';
import { DeliveryApiMode, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { singleItemToArray } from '../../core/core.utils.js';
import { deliveryKontentFetcher as _deliveryKontentFetcher } from '../../fetch/delivery-kontent-fetcher.js';
import { managementKontentFetcher as _managementKontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { fileManager as _fileManager } from '../../files/file-manager.js';
import { itemsGenerator as _itemsGenerator } from './items.generator.js';

export interface GenerateItemsModelsConfig {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly apiKey: string;
    readonly moduleFileExtension: ModuleFileExtension;
    readonly apiMode: DeliveryApiMode;
    readonly filterByTypeCodenames: readonly string[];
    readonly generateTypes: boolean;
    readonly generateObjects: boolean;

    readonly deliveryApiKey?: string;
    readonly outputDir?: string;
    readonly baseUrl?: string;
    readonly deliveryBaseUrl?: string;
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

    await fileManager.createSetsAsync([...singleItemToArray(itemFiles), ...singleItemToArray(codenameFiles)]);

    console.log(chalk.green(`\nCompleted`));
}

async function getFilesAsync(config: GenerateItemsModelsConfig): Promise<{
    readonly itemFiles: GeneratedSet | undefined;
    readonly codenameFiles: GeneratedSet | undefined;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const deliveryKontentFetcher = _deliveryKontentFetcher({
        environmentId: config.environmentId,
        apiMode: config.apiMode,
        apiKey: config.deliveryApiKey,
        baseUrl: config.deliveryBaseUrl
    });

    const managementKontentFetcher = _managementKontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const environmentInfo = await managementKontentFetcher.getEnvironmentInfoAsync();

    const [items, types] = await Promise.all([
        deliveryKontentFetcher.getItemsAsync(config.filterByTypeCodenames),
        managementKontentFetcher.getTypesAsync()
    ]);

    const itemsGenerator = _itemsGenerator({
        environmentData: {
            types: types,
            items: items
        }
    });

    return {
        itemFiles: config.generateObjects ? itemsGenerator.getItemFiles() : undefined,
        codenameFiles: config.generateTypes ? itemsGenerator.getCodenameFiles() : undefined,
        environmentInfo
    };
}
