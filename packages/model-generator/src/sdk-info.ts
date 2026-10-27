/** biome-ignore-all lint/correctness/useImportExtensions: Biome does not have a way to support this feature */
import type { PackageInfo } from "@kontent-ai/model-generator-shared";
import packageJson from "../package.json" with { type: "json" };

export const sdkInfo: PackageInfo = {
	name: packageJson.name,
	version: packageJson.version,
};
