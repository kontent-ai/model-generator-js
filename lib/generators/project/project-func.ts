import chalk from 'chalk';
import { GeneratProjectModelsConfig, ModuleResolution } from '../../models.js';
import { projectGenerator as _projectGenerator } from '../../generators/index.js';
import { commonHelper } from '../../common-helper.js';
import { parse } from 'path';
import { fileHelper } from '../../file-helper.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/kontent-fetcher.js';
import { coreConfig } from 'lib/core/core.config.js';

export async function generateProjectModelsAsync(config: GeneratProjectModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('project')}' models\n`);

    const outputDir: string = config.outputDir ? `${config.outputDir}/`.replaceAll('//', '/') : `./`;

    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    const projectInformation = await kontentFetcher.getEnvironmentInfoAsync();

    const projectFiles = _projectGenerator({
        outputDir: outputDir,
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
        sortConfig: config.sortConfig ?? {
            sortTaxonomyTerms: true
        },
        environmentData: {
            environmentInfo: projectInformation,
            languages: await kontentFetcher.getLanguagesAsync(),
            taxonomies: await kontentFetcher.getTaxonomiesAsync(),
            types: await kontentFetcher.getTypesAsync(),
            workflows: await kontentFetcher.getWorkflowsAsync(),
            assetFolders: await kontentFetcher.getAssetFoldersAsync(),
            collections: await kontentFetcher.getCollectionsAsync(),
            roles: config.isEnterpriseSubscription ? await kontentFetcher.getRolesAsync() : [],
            snippets: await kontentFetcher.getSnippetsAsync(),
            webhooks: await kontentFetcher.getWebhooksAsync()
        }
    }).generateProjectModel();

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
    await fileHelper.createFileOnFsAsync(projectBarrelCode, coreConfig.barrelExportFilename, config.formatOptions);

    console.log(chalk.green(`\nCompleted`));
}
