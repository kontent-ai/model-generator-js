import type { Options } from "prettier";
import { format } from "prettier";

export async function formatCodeAsync(code: string, options?: Readonly<Options>): Promise<string> {
	return await format(code, {
		// default options
		parser: "typescript",
		singleQuote: false,
		printWidth: 140,
		tabWidth: 4,
		useTabs: true,
		trailingComma: "none",
		bracketSpacing: true,
		semi: false,
		// override custom options
		...options,
		// always use organize imports plugin (even without custom options)
		plugins: [...(options?.plugins ?? []), "prettier-plugin-organize-imports"],
	});
}
