import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { colorize } from "@kontent-ai/core-sdk/devkit";

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

/**
 * Loads the '.env' file located in the monorepo root into 'process.env'.
 * The path is resolved relative to this file, so it works regardless of the current working directory (e.g. when run via package scripts).
 */
export function loadMonorepoEnvFile(): void {
	const envFilePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../", ".env");

	if (existsSync(envFilePath)) {
		loadEnvFile(envFilePath);
	}
}
