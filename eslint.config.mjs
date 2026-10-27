import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		// Global ignores
		ignores: ["**/dist/**/*"],
	},
	{
		files: ["lib/**/*.ts", "packages/*/{src,tests,scripts,sample}/**/*.ts", "packages/*/*.config.ts"],
		extends: [kontentAiConfig],
		rules: {
			"no-loop-func": "off",
			"no-unused-vars": "off",
		},
	},
]);
