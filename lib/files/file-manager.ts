import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import * as fs from 'fs';
import { dirname } from 'path';
import { Options } from 'prettier';
import { coreConfig } from '../config.js';
import { getEnvironmentInfoComment } from '../core/comment.utils.js';
import { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../core/core.models.js';
import { toOutputDirPath } from '../core/core.utils.js';
import { importer as _importer } from '../core/importer.js';
import { formatCodeAsync } from '../format/formatter.js';

export function fileManager(config: {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly addTimestamp: boolean;
}) {
    const fixedOutputDir = toOutputDirPath(config.outputDir);
    const importer = _importer(config.moduleFileExtension);

    const createFileOnFsAsync = async (text: string, filePath: string): Promise<void> => {
        const fullFilePath = `${fixedOutputDir.endsWith('/') ? fixedOutputDir : `${fixedOutputDir}/`}${filePath}`;
        const fileContent = `${getEnvironmentInfoComment({
            environmentInfo: config.environmentInfo,
            addTimestamp: config.addTimestamp
        })}\n\n${await getFormattedCodeAsync(text, filePath)}`;

        ensureDirectoryExistence(fullFilePath);
        fs.writeFileSync('./' + fullFilePath, fileContent, {});
        console.log(`Created '${chalk.yellow(fullFilePath)}'`);
    };

    const getFormattedCodeAsync = async (code: string, filePath: string): Promise<string> => {
        try {
            return await formatCodeAsync(code, config.formatOptions);
        } catch {
            console.log(`Failed to format file '${chalk.red(filePath)}'. Skipping prettier for this file.`);
            return code;
        }
    };

    const ensureDirectoryExistence = (filePath: string): void => {
        const resolvedDirname = dirname(filePath);
        if (fs.existsSync(resolvedDirname)) {
            return;
        }
        ensureDirectoryExistence(resolvedDirname);
        fs.mkdirSync(resolvedDirname);
    };

    const createFilesAsync = async (files: readonly GeneratedFile[]): Promise<void> => {
        await Promise.all(
            files.map(async (file) => {
                return await createFileOnFsAsync(file.text, file.filename);
            })
        );
    };

    const createSetAsync = async (set: GeneratedSet): Promise<void> => {
        const setFolder = set.folderName ? `${set.folderName}/` : '';

        await createFilesAsync([
            ...set.files.map((file) => {
                return {
                    filename: `${setFolder}${file.filename}`,
                    text: file.text
                };
            }),
            {
                filename: `${setFolder}${coreConfig.barrelExportFilename}`,
                text: importer.getBarrelExportCode(set.files.map((m) => `./${m.filename}`))
            }
        ]);
    };

    return {
        createFilesAsync,
        createSetAsync,
        createSetsAsync: async (sets: readonly GeneratedSet[]): Promise<void> => {
            await Promise.all(sets.map((set) => createSetAsync(set)));
            await createFileOnFsAsync(
                importer.getBarrelExportCode(
                    sets.flatMap((set) => {
                        if (!set.folderName) {
                            // include file paths themselves if there is no folder
                            return set.files.map((file) => `./${file.filename}`);
                        }

                        const setFolder = set.folderName ? `${set.folderName}/` : '';
                        return `./${setFolder}${coreConfig.barrelExportFilename}`;
                    })
                ),
                coreConfig.barrelExportFilename
            );
        }
    };
}
