import chalk from 'chalk';
import { commonHelper } from '../../common-helper.js';
import { migrationConfig, coreConfig, toOutputDirPath } from '../../core/index.js';
import { fileProcessor as _fileProcessor } from '../../file-helper.js';
import { kontentFetcher as _kontentFetcher } from '../../fetch/index.js';
import { migrationGenerator as _migrationGenerator } from './migration.generator.js';
import { GenerateMigrationModelsConfig, ModuleResolution } from '../../models.js';
import { parse } from 'path';

export async function generateMigrationModelsAsync(config: GenerateMigrationModelsConfig): Promise<void> {
    const kontentFetcher = _kontentFetcher({
        environmentId: config.environmentId,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
    });

    const fileProcessor = _fileProcessor(toOutputDirPath(config.outputDir));
    const migrationItemsFolderName: string = migrationConfig.migrationItemsFolderName;
    const migrationTypesFilename: string = migrationConfig.migrationTypesFilename;

    const projectInformation = await kontentFetcher.getEnvironmentInfoAsync();

    const moduleResolution: ModuleResolution = config.moduleResolution ?? 'node';
    console.log(`Module resolution '${chalk.yellow(moduleResolution)}'\n`);
    const migrationGenerator = _migrationGenerator({
        addTimestamp: config.addTimestamp,
        moduleResolution: config.moduleResolution,
        environmentData: {
            environment: projectInformation,
            taxonomies: await kontentFetcher.getTaxonomiesAsync(),
            languages: await kontentFetcher.getLanguagesAsync(),
            workflows: await kontentFetcher.getWorkflowsAsync(),
            types: await kontentFetcher.getTypesAsync(),
            snippets: await kontentFetcher.getSnippetsAsync(),
            collections: await kontentFetcher.getCollectionsAsync()
        }
    });

    const migrationTypeFile = migrationGenerator.getMigrationTypesFile(migrationTypesFilename);
    const migrationItemFiles = migrationGenerator.getMigrationItemFiles(
        migrationTypesFilename,
        migrationItemsFolderName
    );
    const allFiles = [migrationTypeFile, ...migrationItemFiles];

    // create all files on FS
    for (const file of allFiles) {
        await fileProcessor.createFileOnFsAsync(file.text, file.filename, config.formatOptions);
    }

    // migration items barrel
    await fileProcessor.createFileOnFsAsync(
        commonHelper.getBarrelExportCode({
            moduleResolution: moduleResolution,
            filenames: [
                ...migrationItemFiles.map((m) => {
                    return `./${parse(m.filename).name}`;
                })
            ]
        }),
        `${migrationItemsFolderName}/${coreConfig.barrelExportFilename}`,
        config.formatOptions
    );

    // main barrel
    await fileProcessor.createFileOnFsAsync(
        commonHelper.getBarrelExportCode({
            moduleResolution: moduleResolution,
            filenames: [`./${migrationItemsFolderName}/index`, `./${migrationTypeFile.filename}`]
        }),
        `${coreConfig.barrelExportFilename}`,
        config.formatOptions
    );

    console.log(chalk.green(`\nCompleted`));
}
