import { Options } from 'prettier';
export declare class FileHelper {
    createFileOnFsAsync(text: string, filename: string, formatOptions: Options | undefined): Promise<void>;
    createDir(dirPath: string): void;
}
export declare const fileHelper: FileHelper;
