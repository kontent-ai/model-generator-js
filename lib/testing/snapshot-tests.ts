import { describe, expect, it } from "vitest";
import type { GeneratedFile } from "../core/core.models.js";
import { formatCodeAsync } from "../format/formatter.js";
import type { SnapshotModelsTest } from "./integration-tests.config.js";

/**
 * Registers snapshot tests for given test cases. Snapshot paths are resolved relative to the calling spec file.
 */
export function runSnapshotTests(snapshots: readonly SnapshotModelsTest[]): void {
	for (const snapshot of snapshots) {
		describe(`Integration - ${snapshot.cliAction}`, async () => {
			const files = (await snapshot.getFilesAsync()).toSorted((a, b) => a.filename.localeCompare(b.filename));
			const getSnapshotRelativePath = (file: GeneratedFile) =>
				`./snapshots/${snapshot.cliAction}/${snapshot.folder}/${file.filename}`;

			it("Number of generated files & names should match", async () => {
				const filename = `./snapshots/${snapshot.cliAction}/${snapshot.folder}/_filesList.json`;

				await expect(
					await formatCodeAsync(
						JSON.stringify(files.map<{ filename: string }>((file) => ({ filename: file.filename }))),
						"json",
						undefined,
					),
				).toMatchFileSnapshot(filename, `Invalid file '${filename}'`);
			});

			for (const file of files) {
				it(`File '${file.filename}' should match snapshot`, async () => {
					const filename = getSnapshotRelativePath(file);
					await expect(file.text).toMatchFileSnapshot(filename);
				});

				it(`File '${file.filename}' code should format TS code without throwing exception`, async () => {
					await expect(formatCodeAsync(file.text, "typescript", undefined)).resolves.toBeTruthy();
				});
			}
		});
	}
}
