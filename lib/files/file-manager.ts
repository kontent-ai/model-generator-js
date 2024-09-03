import { EnvironmentModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import * as fs from 'fs';
import { dirname } from 'path';
import { Options } from 'prettier';
import { commentsManager } from '../comments/index.js';
import { GeneratedFile, toOutputDirPath } from '../core/index.js';
import { formatCodeAsync } from '../format/formatter.js';

export function fileManager(config: {
    readonly outputDir: string | undefined;
    readonly formatOptions: Readonly<Options> | undefined;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly addTimestamp: boolean;
}) {
    const fixedOutputDir = toOutputDirPath(config.outputDir);

    const createFileOnFsAsync = async (text: string, filePath: string, formatOptions: Readonly<Options> | undefined): Promise<void> => {
        const fullFilePath = `${fixedOutputDir.endsWith('/') ? fixedOutputDir : `${fixedOutputDir}/`}${filePath}`;
        const fileContent = `${commentsManager().getEnvironmentInfoComment({
            environmentInfo: config.environmentInfo,
            addTimestamp: config.addTimestamp
        })}\n\n${await getFormattedCodeAsync(text, filePath, formatOptions)}`;

        ensureDirectoryExistence(fullFilePath);
        fs.writeFileSync('./' + fullFilePath, fileContent, {});
        console.log(`Created '${chalk.yellow(fullFilePath)}'`);
    };

    const getFormattedCodeAsync = async (code: string, filePath: string, formatOptions: Readonly<Options> | undefined): Promise<string> => {
        try {
            return await formatCodeAsync(code, formatOptions);
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
                return await createFileOnFsAsync(file.text, file.filename, config.formatOptions);
            })
        );
    };

    return {
        createFilesAsync
    };
}
