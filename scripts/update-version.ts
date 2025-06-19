import { replaceSdkVersionPlaceholder } from "@kontent-ai/core-sdk/devkit";
import packageJson from "../package.json" with { type: "json" };

replaceSdkVersionPlaceholder("./dist/sdk-info.js", packageJson.version);
