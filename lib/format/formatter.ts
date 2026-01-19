import { Biome } from "@biomejs/js-api/nodejs";
import type { Configuration, ProjectKey } from "@biomejs/wasm-nodejs";

export type FormatOptions = Readonly<Configuration>;

export async function formatCodeAsync(code: string, configuration: FormatOptions | undefined): Promise<string> {
	const result = withBiome(configuration, (biome, projectKey) => {
		const formattedContent = biome.formatContent(projectKey, code, {
			filePath: "virtual.ts",
		});

		if (formattedContent.diagnostics.length > 0) {
			throw new Error(`Failed to format code: ${formattedContent.diagnostics.map((m) => m.message).join("\n")}`);
		}

		const lintedContent = biome.lintContent(projectKey, formattedContent.content, {
			filePath: "virtual.ts",
			fixFileMode: "safeFixes",
		});

		if (lintedContent.diagnostics.length > 0) {
			throw new Error(`Failed to lint code: ${lintedContent.diagnostics.map((m) => m.message).join("\n")}`);
		}

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
