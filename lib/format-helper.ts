import { Options, format } from 'prettier';

export class FormatHelper {
    async formatCodeAsync(code: string, options?: Options): Promise<string> {
        const formatOptions: Options = options
            ? options
            : {
                  parser: 'typescript',
                  singleQuote: true,
                  printWidth: 120,
                  tabWidth: 4,
                  useTabs: false,
                  trailingComma: 'none',
                  bracketSpacing: true,
                  semi: true
              };

        return await format(code, formatOptions);
    }
}

export const formatHelper = new FormatHelper();
