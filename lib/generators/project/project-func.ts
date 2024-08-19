import chalk from 'chalk';
import { GeneratProjectModelsConfig, ModuleResolution } from '../../models.js';
import { projectGenerator } from '../../generators/index.js';
import { commonHelper } from '../../common-helper.js';
import { parse } from 'path';
import { fileHelper } from '../../file-helper.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';

export async function generateProjectModelsAsync(config: GeneratProjectModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('delivery')}' models\n`);

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;

    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    const projectInformation = await kontentFetcher.getEnvironmentInfoAsync();

    const types = await kontentFetcher.getTypesAsync();
    const snippets = await kontentFetcher.getSnippetsAsync();
    const taxonomies = await kontentFetcher.getTaxonomiesAsync();

    const workflows = await kontentFetcher.getWorkflowsAsync();
    const roles = config.isEnterpriseSubscription ? await kontentFetcher.getRolesAsync() : [];
    const assetFolders = await kontentFetcher.getAssetFoldersAsync();
    const collections = await kontentFetcher.getCollectionsAsync();
    const webhooks = await kontentFetcher.getWebhooksAsync();
    const languages = await kontentFetcher.getLanguagesAsync();

    const projectFiles = projectGenerator.generateProjectModel({
        outputDir: outputDir,
        environmentInfo: projectInformation,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        addEnvironmentInfo: config.addEnvironmentInfo,
        languages: languages,
        taxonomies: taxonomies,
        types: types,
        workflows: workflows,
        assetFolders: assetFolders,
        collections: collections,
        roles: roles,
        snippets: snippets,
        webhooks: webhooks,
        sortConfig: config.sortConfig ?? {
            sortTaxonomyTerms: true
        }
    });

    // create barrel export
    const barrelExportFilename: string = 'index.ts';

    // project barrel
    for (const file of projectFiles) {
        await fileHelper.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }
    const projectBarrelCode = commonHelper.getBarrelExportCode({
        moduleResolution: moduleResolution,
        filenames: [
            ...projectFiles.map((m) => {
                const path = parse(m.filename);
                return `./${path.name}`;
            })
        ]
    });
    await fileHelper.createFileOnFsAsync(projectBarrelCode, barrelExportFilename, config.formatOptions);

    console.log(chalk.green(`\nCompleted`));
}
