import { defineConfig } from "vitest/config";

export default defineConfig({
	root: ".",
	test: {
		dir: "tests",
		globals: true,
		environment: "node",
	},
	build: {
		target: "esnext",
	},
});
