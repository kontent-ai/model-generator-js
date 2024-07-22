import chalk from 'chalk';
import { Options } from 'prettier';
import { formatHelper } from './format-helper.js';
import * as fs from 'fs';

export class FileHelper {
    async createFileOnFsAsync(text: string, filename: string, formatOptions: Options | undefined): Promise<void> {
        const finalFilename = `${filename}`;
        try {
            const contentToStore = await formatHelper.formatCodeAsync(text, formatOptions);

            fs.writeFileSync('./' + finalFilename, contentToStore);
            console.log(`Created '${chalk.yellow(finalFilename)}'`);
        } catch (error) {
            console.log(`Failed to format file '${chalk.red(filename)}'. Skipping prettier for this file.`);

            const contentToStore = text;

            fs.writeFileSync('./' + finalFilename, contentToStore);
            console.log(`Created '${chalk.yellow(finalFilename)}'`);
        }
    }

    createDir(dirPath: string): void {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export const fileHelper = new FileHelper();
