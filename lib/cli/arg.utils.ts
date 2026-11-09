import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { defaultDeliveryApiMode, defaultModuleFileExtension } from "../config.js";
import type { DeliveryApiMode, LiteralUnion, ModuleFileExtension } from "../core/core.models.js";

type ArgvResult = {
	readonly [x: string]: unknown;
	readonly _: readonly (string | number)[];
	readonly $0: string;
};

export function getCliArgs(): Argv {
	return yargs(hideBin(process.argv));
}

export async function parseCliArgsAsync(args?: Argv): Promise<ArgvResult> {
	const resolvedArgv: ArgvResult = await (args ?? getCliArgs()).argv;
	return resolvedArgv;
}

export function parseModuleFileExtension(moduleFileExtension: LiteralUnion<ModuleFileExtension> | undefined): ModuleFileExtension {
	return moduleFileExtensionOptions[moduleFileExtension ?? defaultModuleFileExtension] ?? defaultModuleFileExtension;
}

export function parseDeliveryApiMode(apiMode: LiteralUnion<DeliveryApiMode> | undefined): DeliveryApiMode {
	return deliveryApiModeOptions[apiMode ?? defaultDeliveryApiMode] ?? defaultDeliveryApiMode;
}

export const moduleFileExtensionOptions: Record<LiteralUnion<ModuleFileExtension>, ModuleFileExtension> = {
	js: "js",
	ts: "ts",
	mts: "mts",
	mjs: "mjs",
	none: "none",
};

export const deliveryApiModeOptions: Record<LiteralUnion<DeliveryApiMode>, DeliveryApiMode> = {
	default: "default",
	preview: "preview",
	secure: "secure",
};
