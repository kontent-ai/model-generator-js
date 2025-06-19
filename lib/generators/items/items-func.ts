import type { EnvironmentModels } from "@kontent-ai/management-sdk";
import chalk from "chalk";
import type { Options } from "prettier";
import type {
	CliAction,
	CreateFilesConfig,
	DeliveryApiMode,
	GeneratedFile,
	GeneratedSet,
	ModuleFileExtension,
} from "../../core/core.models.js";
import { singleItemToArray } from "../../core/core.utils.js";
import { getDeliveryKontentFetcher } from "../../fetch/delivery-kontent-fetcher.js";
import { getManagementKontentFetcher } from "../../fetch/management-kontent-fetcher.js";
import { getFileManager } from "../../files/file-manager.js";
import { getItemsGenerator } from "./items.generator.js";

export type GenerateItemsModelsConfig = {
	readonly environmentId: string;
	readonly addTimestamp: boolean;
	readonly managementApiKey: string;
	readonly moduleFileExtension: ModuleFileExtension;
	readonly apiMode: DeliveryApiMode;
	readonly filterByTypeCodenames: readonly string[];
	readonly generateTypes: boolean;
	readonly generateObjects: boolean;

	readonly deliveryApiKey?: string;
	readonly managementBaseUrl?: string;
	readonly deliveryBaseUrl?: string;
	readonly formatOptions?: Readonly<Options>;
} & CreateFilesConfig;

export async function generateItemsAsync(config: GenerateItemsModelsConfig): Promise<readonly GeneratedFile[]> {
	console.log(chalk.green("Model generator started \n"));
	console.log(`Generating '${chalk.yellow("items" satisfies CliAction)}' models\n`);

	const { itemFiles, environmentInfo, codenameFiles } = await getFilesAsync(config);

	const fileManager = getFileManager({
		...config,
		environmentInfo,
	});

	const setFiles = await fileManager.getSetFilesAsync([...singleItemToArray(itemFiles), ...singleItemToArray(codenameFiles)]);

	if (config.createFiles) {
		fileManager.createFiles(setFiles);
	}

	console.log(chalk.green("\nCompleted"));

	return setFiles;
}

async function getFilesAsync(config: GenerateItemsModelsConfig): Promise<{
	readonly itemFiles: GeneratedSet | undefined;
	readonly codenameFiles: GeneratedSet | undefined;
	readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}> {
	const deliveryKontentFetcher = getDeliveryKontentFetcher({
		environmentId: config.environmentId,
		apiMode: config.apiMode,
		deliveryApiKey: config.deliveryApiKey,
		baseUrl: config.deliveryBaseUrl,
	});

	const managementKontentFetcher = getManagementKontentFetcher({
		environmentId: config.environmentId,
		managementApiKey: config.managementApiKey,
		baseUrl: config.managementBaseUrl,
	});

	const environmentInfo = await managementKontentFetcher.getEnvironmentInfoAsync();

	const [items, types] = await Promise.all([
		deliveryKontentFetcher.getItemsAsync(config.filterByTypeCodenames),
		managementKontentFetcher.getTypesAsync(),
	]);

	const itemsGenerator = getItemsGenerator({
		environmentData: {
			types: types,
			items: items,
		},
	});

	return {
		itemFiles: config.generateObjects ? itemsGenerator.getItemFiles() : undefined,
		codenameFiles: config.generateTypes ? itemsGenerator.getCodenameFiles() : undefined,
		environmentInfo,
	};
}
