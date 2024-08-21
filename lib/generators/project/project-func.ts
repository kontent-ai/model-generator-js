import chalk from 'chalk';
import { GeneratProjectModelsConfig, ModuleResolution } from '../../models.js';
import { projectGenerator as _projectGenerator } from './project.generator.js';
import { fileProcessor as _fileProcessor } from '../../files/index.js';
import { parse } from 'path';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { coreConfig, getBarrelExportCode, toOutputDirPath } from '../../core/index.js';

export async function generateProjectModelsAsync(config: GeneratProjectModelsConfig): Promise<void> {
    console.log(chalk.green(`Model generator started \n`));
    console.log(`Generating '${chalk.yellow('project')}' models\n`);
    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';

    const fileProcessor = _fileProcessor(toOutputDirPath(config.outputDir));
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const projectInformation = await kontentFetcher.getEnvironmentInfoAsync();

    const projectFiles = _projectGenerator({
        addTimestamp: config.addTimestamp,
        formatOptions: config.formatOptions,
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

    await fileProcessor.createFilesAsync(
        [
            ...projectFiles,
            // barrel file
            {
                filename: coreConfig.barrelExportFilename,
                text: getBarrelExportCode({
                    moduleResolution: moduleResolution,
                    filenames: [
                        ...projectFiles.map((m) => {
                            const path = parse(m.filename);
                            return `./${path.name}`;
                        })
                    ]
                })
            }
        ],
        config.formatOptions
    );

    console.log(chalk.green(`\nCompleted`));
}
