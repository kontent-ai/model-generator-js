import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	{
		files: ["lib/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts", "sample/**/*.ts"],
		extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/eslint-recommended"),

		plugins: {
			"@typescript-eslint": typescriptEslint,
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 5,
			sourceType: "module",

			parserOptions: {
				project: ["./tsconfig.json"],
			},
		},

		settings: {
			react: {
				version: "detect",
			},
		},

		rules: {
			"no-loop-func": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/no-floating-promises": ["error"],
			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-redundant-type-constituents": "error",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unnecessary-condition": "error",
			"@typescript-eslint/prefer-includes": "error",
			"@typescript-eslint/prefer-return-this-type": "error",
			"@typescript-eslint/prefer-string-starts-ends-with": "error",
			"@typescript-eslint/prefer-for-of": "error",
			"@typescript-eslint/prefer-function-type": "error",
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/prefer-reduce-type-parameter": "error",
			"@typescript-eslint/prefer-ts-expect-error": "error",
		},
	},
]);
