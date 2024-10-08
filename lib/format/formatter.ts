import { Options, format } from 'prettier';

export async function formatCodeAsync(code: string, options?: Readonly<Options>): Promise<string> {
    return await format(
        code,
        options ?? {
            parser: 'typescript',
            singleQuote: true,
            printWidth: 140,
            tabWidth: 4,
            useTabs: false,
            trailingComma: 'none',
            bracketSpacing: true,
            semi: true
        }
    );
}
