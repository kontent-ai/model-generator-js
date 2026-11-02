import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/cli/app.ts"],
	format: "esm",
	platform: "node",
	target: "node22",
	fixedExtension: false,
	// tsgo (TypeScript 7) emits declarations relative to the tsconfig's directory, so a root
	// tsconfig is needed for the bundled shared package's declarations to be emitted
	dts: { tsconfig: "../../tsconfig.dts.json" },
	clean: true,
	deps: {
		// shared code is a private workspace package, so it is bundled into the published output
		alwaysBundle: [/^@kontent-ai\/model-generator-shared/],
	},
});
