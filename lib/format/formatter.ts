import type { Options } from "prettier";
import { format } from "prettier";

export async function formatCodeAsync(code: string, options?: Readonly<Options>): Promise<string> {
	return await format(
		code,
		options ?? {
			parser: "typescript",
			singleQuote: false,
			printWidth: 140,
			tabWidth: 4,
			useTabs: true,
			trailingComma: "none",
			bracketSpacing: true,
			semi: false,
			plugins: ["prettier-plugin-organize-imports"],
		},
	);
}
