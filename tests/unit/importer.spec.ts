import { describe, expect, it } from "vitest";
import { getImporter } from "../../lib/core/importer.js";
import { formatCodeAsync } from "../../lib/format/formatter.js";
import type { ModuleFileExtension } from "../../lib/public_api.js";

for (const moduleFileExtension of ["js", "ts", "mjs", "mts", "none"] satisfies ModuleFileExtension[]) {
	describe(`Importer - ${moduleFileExtension}`, () => {
		const importer = getImporter(moduleFileExtension);
		const expectedExtension = moduleFileExtension === "none" ? "" : `.${moduleFileExtension}`;

		it(`Empty barrel code (${moduleFileExtension})`, () => {
			expect(importer.getBarrelExportCode([])).toStrictEqual("export {}");
		});

		it("Files should be ordered and exported types should be valid", async () => {
			const inputFiles: readonly string[] = ["./dir/fileC", "./dir/fileB", "./dir/fileA"];

			expect(await formatCodeAsync(importer.getBarrelExportCode(inputFiles))).toStrictEqual(
				await formatCodeAsync(`
export * from './dir/fileA${expectedExtension}';
export * from './dir/fileB${expectedExtension}';
export * from './dir/fileC${expectedExtension}';
`),
			);
		});

		it("Import from external library is valid", () => {
			expect(
				importer.importType({
					filePathOrPackage: "@kontent-ai/delivery-sdk",
					importValue: "ContentItem",
				}),
			).toStrictEqual(`import type { ContentItem } from '@kontent-ai/delivery-sdk';`);
		});

		const fileImports: readonly string[] = ["./dir/fileA.js", "./fileB.ts"];

		for (const filesToImport of fileImports) {
			const fileWithoutExtension = filesToImport.replace(/\.js|\.ts/, "");
			it(`Import from internal file is valid and uses extension '${expectedExtension}'`, () => {
				expect(
					importer.importType({
						filePathOrPackage: filesToImport,
						importValue: "Item",
					}),
				).toStrictEqual(`import type { Item } from '${fileWithoutExtension}.generated${expectedExtension}';`);
			});
		}
	});
}
