import { Options } from 'prettier';
export declare class FormatHelper {
    formatCodeAsync(code: string, options?: Options): Promise<string>;
}
export declare const formatHelper: FormatHelper;
