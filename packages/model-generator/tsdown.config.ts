import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/cli/app.ts"],
	format: "esm",
	platform: "node",
	target: "node22",
	fixedExtension: false,
	// declarations of the bundled shared package are only emitted with eager mode
	dts: { eager: true },
	clean: true,
	deps: {
		// shared code is a private workspace package, so it is bundled into the published output
		alwaysBundle: [/^@kontent-ai\/model-generator-shared/],
	},
});
