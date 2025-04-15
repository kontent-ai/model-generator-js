import type { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import type { Options } from 'prettier';
import type { CliAction, CreateFilesConfig, GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { getManagementKontentFetcher } from '../../fetch/management-kontent-fetcher.js';
import { getFileManager } from '../../files/file-manager.js';
import type { DeliveryFileResolvers, DeliveryNameResolvers } from './delivery-content-type.generator.js';
import { deliveryContentTypeGenerator } from './delivery-content-type.generator.js';

export type GenerateDeliveryModelsConfig = {
    readonly environmentId: string;
    readonly addTimestamp: boolean;
    readonly managementApiKey: string;
    readonly moduleFileExtension: ModuleFileExtension;

    readonly managementBaseUrl?: string;
    readonly formatOptions?: Readonly<Options>;

    readonly fileResolvers?: DeliveryFileResolvers;
    readonly nameResolvers?: DeliveryNameResolvers;
} & CreateFilesConfig;

export async function generateDeliveryModelsAsync(config: GenerateDeliveryModelsConfig): Promise<readonly GeneratedFile[]> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery-sdk' satisfies CliAction)}' models\n`);

    const { contentTypeFiles, snippetFiles, entitySets, environmentInfo, systemFiles } = await getFilesAsync(config);

    const fileManager = getFileManager({
        ...config,
        environmentInfo
    });

    const setFiles = await fileManager.getSetFilesAsync([contentTypeFiles, snippetFiles, systemFiles, ...entitySets]);

    if (config.createFiles) {
        fileManager.createFiles(setFiles);
    }

    console.log(chalk.green(`\nCompleted`));

    return setFiles;
}

async function getFilesAsync(config: GenerateDeliveryModelsConfig): Promise<{
    readonly contentTypeFiles: GeneratedSet;
    readonly snippetFiles: GeneratedSet;
    readonly entitySets: readonly GeneratedSet[];
    readonly systemFiles: GeneratedSet;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
    const kontentFetcher = getManagementKontentFetcher({
        environmentId: config.environmentId,
        managementApiKey: config.managementApiKey,
        baseUrl: config.managementBaseUrl
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
        moduleFileExtension: config.moduleFileExtension,
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

    return {
        contentTypeFiles,
        snippetFiles,
        environmentInfo,
        systemFiles: deliveryGenerator.getSystemFiles(),
        entitySets: deliveryGenerator.getEntitySets()
    };
}
