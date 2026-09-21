import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { colorize } from "@kontent-ai/core-sdk/devkit";

// needed to load .env environment to current process when run via package.json script
loadEnvironmentVariables();

export function getEnvironmentRequiredValue(variableName: string): string {
	const value = getEnvironmentOptionalValue(variableName);

	if (!value) {
		throw new Error(`Missing environment variable '${colorize("red", variableName)}'`);
	}

	return value;
}

export function getEnvironmentOptionalValue(variableName: string): string | undefined {
	return process.env[variableName];
}

function loadEnvironmentVariables(): void {
	const envFilePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../", ".env");

	if (existsSync(envFilePath)) {
		loadEnvFile(envFilePath);
	}
}
