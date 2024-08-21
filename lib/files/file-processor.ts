import chalk from 'chalk';
import { Options } from 'prettier';
import { formatHelper } from '../format-helper.js';
import * as fs from 'fs';
import { dirname } from 'path';
import { GeneratedFile } from '../core/index.js';

export function fileProcessor(outputDir: string) {
    const createFileOnFsAsync = async (
        text: string,
        filePath: string,
        formatOptions: Options | undefined
    ): Promise<void> => {
        const fullFilePath = `${outputDir.endsWith('/') ? outputDir : `${outputDir}/`}${filePath}`;
        let fileContent = text;
        try {
            fileContent = await formatHelper.formatCodeAsync(fileContent, formatOptions);
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

    const createFilesAsync = async (
        files: readonly GeneratedFile[],
        formatOptions: Options | undefined
    ): Promise<void> => {
        await Promise.all(
            files.map((file) => {
                return createFileOnFsAsync(file.text, file.filename, formatOptions);
            })
        );
    };

    return {
        createDir,
        createFileOnFsAsync,
        createFilesAsync
    };
}
