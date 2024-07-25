import chalk from 'chalk';
import { Options } from 'prettier';
import { formatHelper } from './format-helper.js';
import * as fs from 'fs';
import { dirname } from 'path';

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
        } catch (error) {
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

    return {
        createDir,
        createFileOnFsAsync
    };
}

export class FileHelper {
    async createFileOnFsAsync(text: string, filePath: string, formatOptions: Options | undefined): Promise<void> {
        const fullFilePath = `${filePath}`;
        try {
            const contentToStore = await formatHelper.formatCodeAsync(text, formatOptions);

            this.ensureDirectoryExistence(fullFilePath);
            fs.writeFileSync('./' + fullFilePath, contentToStore, {});
            console.log(`Created '${chalk.yellow(fullFilePath)}'`);
        } catch (error) {
            console.log(`Failed to format file '${chalk.red(filePath)}'. Skipping prettier for this file.`);

            const contentToStore = text;

            fs.writeFileSync('./' + fullFilePath, contentToStore);
            console.log(`Created '${chalk.yellow(fullFilePath)}'`);
        }
    }

    createDir(dirPath: string): void {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    private ensureDirectoryExistence(filePath: string): void {
        const resolvedDirname = dirname(filePath);
        if (fs.existsSync(resolvedDirname)) {
            return;
        }
        this.ensureDirectoryExistence(resolvedDirname);
        fs.mkdirSync(resolvedDirname);
    }
}

export const fileHelper = new FileHelper();
