import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		// Global ignores
		ignores: ["dist/**/*"],
	},
	{
		files: ["lib/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts", "sample/**/*.ts"],
		extends: [kontentAiConfig],
		rules: {
			"no-loop-func": "off",
			"no-unused-vars": "off",
		},
	},
]);
