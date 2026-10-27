import { runSnapshotTests } from "@kontent-ai/model-generator-shared/testing";
import { environmentSnapshots } from "./environment-snapshots.js";
import { itemsSnapshots } from "./items-snapshots.js";

runSnapshotTests([...environmentSnapshots, ...itemsSnapshots]);
