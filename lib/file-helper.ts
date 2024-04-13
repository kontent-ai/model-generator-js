import Colors from 'colors';
import { Options } from 'prettier';
import { formatHelper } from './format-helper.js';
import * as fs from 'fs';

export class FileHelper {
    async createFileOnFsAsync(text: string, filename: string, formatOptions: Options | undefined): Promise<void> {
        const finalFilename = `${filename}`;
        const contentToStore = await formatHelper.formatCodeAsync(text, formatOptions);

        fs.writeFileSync('./' + finalFilename, contentToStore);
        console.log(`Created '${Colors.yellow(finalFilename)}'`);
    }

    createDir(dirPath: string): void {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export const fileHelper = new FileHelper();
