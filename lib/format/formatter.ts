import { Options, format } from 'prettier';

export async function formatCodeAsync(code: string, options?: Readonly<Options>): Promise<string> {
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
