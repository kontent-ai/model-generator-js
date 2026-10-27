import type { DeliveryApiMode, ModuleFileExtension, PackageInfo } from "./core/core.models.js";

export const defaultModuleFileExtension: ModuleFileExtension = "js";
export const defaultDeliveryApiMode: DeliveryApiMode = "default";

export const coreConfig = {
	barrelExportFilename: "index.ts",
	kontentTrackingHeaderName: "X-KC-SOURCE",
} as const;

export function getTrackingHeaderValue(packageInfo: PackageInfo): string {
	return `${packageInfo.name};${packageInfo.version}`;
}
