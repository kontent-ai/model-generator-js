import type { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import * as fs from 'fs';
import { dirname } from 'path';
import type { Options } from 'prettier';
import { coreConfig } from '../config.js';
import { getEnvironmentInfoComment } from '../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../core/core.models.js';
import { toOutputDirPath } from '../core/core.utils.js';
import { getImporter } from '../core/importer.js';
import { formatCodeAsync } from '../format/formatter.js';

export function getFileManager(config: {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly outputDir?: string;
    readonly formatOptions?: Readonly<Options>;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly addTimestamp: boolean;
}) {
    const fixedOutputDir = toOutputDirPath(config.outputDir);
    const importer = getImporter(config.moduleFileExtension);

    const createFileOnFs = (text: string, filePath: string): void => {
        const fullFilePath = `${fixedOutputDir.endsWith('/') ? fixedOutputDir : `${fixedOutputDir}/`}${filePath}`;
        const fileContent = `${getEnvironmentInfoComment({
            environmentInfo: config.environmentInfo,
            timestampDate: config.addTimestamp ? new Date() : undefined
        })}\n\n${text}`;

        ensureDirectoryExistence(fullFilePath);
        fs.writeFileSync('./' + fullFilePath, fileContent, {});
        console.log(`Created '${chalk.yellow(fullFilePath)}'`);
    };

    const getFormattedCodeAsync = async (code: string, filePath: string): Promise<string> => {
        try {
            if (filePath.endsWith('.ts')) {
                return await formatCodeAsync(code, config.formatOptions);
            }
            return code;
        } catch {
            console.log(`Failed to format file '${chalk.red(filePath)}'. Skipping prettier.`);
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

    const createFiles = (files: readonly GeneratedFile[]): void => {
        for (const file of files) {
            createFileOnFs(file.text, file.filename);
        }
    };

    const getSetFolder = (set: GeneratedSet): string => {
        return set.folderName ? `${set.folderName}/` : '';
    };

    const getSetFiles = (set: GeneratedSet): readonly GeneratedFile[] => {
        const setFolder = getSetFolder(set);
        const setFiles: readonly GeneratedFile[] = set.files.map<GeneratedFile>((file) => {
            return {
                filename: `${setFolder}${file.filename}`,
                text: file.text
            };
        });

        if (!set.folderName) {
            return setFiles;
        }

        return [
            ...setFiles,
            {
                filename: `${setFolder}${coreConfig.barrelExportFilename}`,
                text: importer.getBarrelExportCode(set.files.map((m) => `./${m.filename}`))
            }
        ];
    };

    const getSetsBarrelExportFiles = (sets: readonly GeneratedSet[]): GeneratedFile => {
        return {
            filename: coreConfig.barrelExportFilename,
            text: importer.getBarrelExportCode(
                sets.flatMap((set) => {
                    if (!set.folderName) {
                        // include file paths themselves if there is no folder
                        return set.files.map((file) => `./${file.filename}`);
                    }

                    return `./${getSetFolder(set)}${coreConfig.barrelExportFilename}`;
                })
            )
        };
    };

    return {
        getSetFilesAsync: async (sets: readonly GeneratedSet[]): Promise<readonly GeneratedFile[]> => {
            return await Promise.all(
                [...sets.flatMap((set) => getSetFiles(set)), getSetsBarrelExportFiles(sets)].map<Promise<GeneratedFile>>(async (file) => {
                    return {
                        filename: file.filename,
                        text: await getFormattedCodeAsync(file.text, file.filename)
                    };
                })
            );
        },
        createFiles
    };
}
