import chalk from 'chalk';
import { Options } from 'prettier';
import { formatCodeAsync } from '../format/formatter.js';
import * as fs from 'fs';
import { dirname } from 'path';
import { GeneratedFile, toOutputDirPath } from '../core/index.js';
import { EnvironmentModels } from '@kontent-ai/management-sdk';
import { commentsManager } from '../comments/index.js';

export function fileManager(config: {
    outputDir: string | undefined;
    formatOptions: Readonly<Options> | undefined;
    environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    addTimestamp: boolean;
}) {
    const fixedOutputDir = toOutputDirPath(config.outputDir);

    const createFileOnFsAsync = async (
        text: string,
        filePath: string,
        formatOptions: Readonly<Options> | undefined
    ): Promise<void> => {
        const fullFilePath = `${fixedOutputDir.endsWith('/') ? fixedOutputDir : `${fixedOutputDir}/`}${filePath}`;

        let fileContent =
            `${commentsManager().getEnvironmentInfoComment({
                environmentInfo: config.environmentInfo,
                addTimestamp: config.addTimestamp
            })}\n\n` + text;
        try {
            fileContent = await formatCodeAsync(fileContent, formatOptions);
        } catch {
            console.log(`Failed to format file '${chalk.red(filePath)}'. Skipping prettier for this file.`);
        } finally {
            ensureDirectoryExistence(fullFilePath);
            fs.writeFileSync('./' + fullFilePath, fileContent, {});
            console.log(`Created '${chalk.yellow(fullFilePath)}'`);
        }
    };

    const createDir = (dirPath: string): void => {
        fs.mkdirSync(dirPath, { recursive: true });
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
            files.map((file) => {
                return createFileOnFsAsync(file.text, file.filename, config.formatOptions);
            })
        );
    };

    return {
        createDir,
        createFileOnFsAsync,
        createFilesAsync
    };
}
