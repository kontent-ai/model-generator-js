/** biome-ignore-all lint/correctness/useImportExtensions: Biome does not have a way to support this feature */
import { replaceSdkVersionPlaceholder } from "@kontent-ai/core-sdk/devkit";
import packageJson from "../package.json" with { type: "json" };

replaceSdkVersionPlaceholder("./dist/sdk-info.js", packageJson.version);
