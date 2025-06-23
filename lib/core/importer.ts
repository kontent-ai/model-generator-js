import { parse } from "node:path";
import type { LibraryType, LiteralUnion, ModuleFileExtension } from "./core.models.js";
import { getFileNameWithoutExtension, sortAlphabetically } from "./core.utils.js";

export function getImporter(moduleFileExtension: ModuleFileExtension) {
	const importExtension = moduleFileExtension === "none" ? "" : `.${moduleFileExtension}`;

	return {
		importType: (data: { readonly filePathOrPackage: LiteralUnion<LibraryType>; readonly importValue: string | string[] }): string => {
			if (!data.importValue.length) {
				return "";
			}

			const isExternalLib = !(data.filePathOrPackage.endsWith(".js") || data.filePathOrPackage.endsWith(".ts"));
			const resolvedFilePath = isExternalLib
				? data.filePathOrPackage
				: `${getFileNameWithoutExtension(data.filePathOrPackage)}${importExtension}`;
			const importValues = Array.isArray(data.importValue) ? data.importValue : [data.importValue];

			return `import type { ${importValues.join(", ")} } from '${resolvedFilePath}';`;
		},
		getBarrelExportCode(filenames: readonly string[]): string {
			if (!filenames.length) {
				return "export {}";
			}
			return sortAlphabetically(filenames, (filename) => filename).reduce<string>((barrelCode, filename) => {
				const path = parse(filename);
				return `${barrelCode} export * from '${path.dir}/${path.name}${importExtension}';`;
			}, "");
		},
	};
}
