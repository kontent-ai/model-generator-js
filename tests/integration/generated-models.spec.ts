import { describe, expect, it } from "vitest";
import type { GeneratedFile } from "../../lib/core/core.models.js";
import { formatCodeAsync } from "../../lib/format/formatter.js";
import { deliverySdkSnapshots } from "./test-cases/delivery-sdk-snapshots.js";
import { environmentSnapshots } from "./test-cases/environment-snapshots.js";
import { itemsSnapshots } from "./test-cases/items-snapshots.js";
import { migrationToolkitSnapshots } from "./test-cases/migration-toolkit-snapshots.js";
import { syncSdkSnapshots } from "./test-cases/sync-sdk-snapshots.js";

for (const snapshot of [
	...deliverySdkSnapshots,
	...environmentSnapshots,
	...migrationToolkitSnapshots,
	...itemsSnapshots,
	...syncSdkSnapshots,
]) {
	describe(`Integration - ${snapshot.cliAction}`, async () => {
		const files = (await snapshot.getFilesAsync()).toSorted((a, b) => a.filename.localeCompare(b.filename));
		const getSnapshotRelativePath = (file: GeneratedFile) => `./snapshots/${snapshot.cliAction}/${snapshot.folder}/${file.filename}`;

		it("Number of generated files & names should match", async () => {
			const filename = `./snapshots/${snapshot.cliAction}/${snapshot.folder}/_filesList.json`;

			await expect(
				await formatCodeAsync(JSON.stringify(files.map<{ filename: string }>((file) => ({ filename: file.filename }))), undefined),
			).toMatchFileSnapshot(filename, `Invalid file '${filename}'`);
		});

		for (const file of files) {
			it(`File '${file.filename}' should match snapshot`, async () => {
				const filename = getSnapshotRelativePath(file);
				await expect(file.text).toMatchFileSnapshot(filename);
			});

			it(`File '${file.filename}' code should format TS code without throwing exception`, async () => {
				await expect(formatCodeAsync(file.text, undefined)).resolves.toBeTruthy();
			});
		}
	});
}
