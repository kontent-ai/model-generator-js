import { Biome } from "@biomejs/js-api/nodejs";
import type { Configuration, ProjectKey } from "@biomejs/wasm-nodejs";

export type FormatOptions = Readonly<Configuration>;
export type FormatType = "typescript" | "json";

export async function formatCodeAsync(code: string, formatType: FormatType, configuration: FormatOptions | undefined): Promise<string> {
	const result = withBiome(configuration, (biome, projectKey) => {
		const formattedContent = biome.formatContent(projectKey, code, {
			filePath: formatType === "typescript" ? "virtual.ts" : "virtual.json",
		});

		// 'formatContent' only runs the formatter; assist actions such as 'organizeImports' (and safe lint fixes
		// like removing unused imports) are applied by 'lintContent' with a fix mode. JSON has nothing to organize.
		if (formatType !== "typescript") {
			return formattedContent.content;
		}

		const lintedContent = biome.lintContent(projectKey, formattedContent.content, {
			filePath: "virtual.ts",
			fixFileMode: "safeFixes",
		});

		return lintedContent.content;
	});

	return await Promise.resolve(result);
}

function withBiome(configuration: FormatOptions | undefined, callback: (biome: Biome, projectKey: ProjectKey) => string): string {
	const biome = new Biome();
	const { projectKey } = biome.openProject();
	biome.applyConfiguration(
		projectKey,
		configuration ?? {
			extends: ["@kontent-ai/biome-config/base"],
			formatter: {
				indentWidth: 4,
				indentStyle: "tab",
				lineWidth: 140,
			},
			assist: {
				enabled: true,
				actions: {
					source: {
						organizeImports: "on",
					},
				},
			},
			linter: {
				rules: {
					performance: {
						noBarrelFile: "off",
					},
					correctness: {
						noUnusedImports: {
							fix: "safe",
							level: "error",
						},
					},
				},
			},
		},
	);

	const result = callback(biome, projectKey);

	biome.shutdown();

	return result;
}
