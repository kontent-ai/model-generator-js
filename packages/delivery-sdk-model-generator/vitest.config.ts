import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		dir: "tests/integration",
		globals: true,
		environment: "node",
	},
});
