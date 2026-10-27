import { runSnapshotTests } from "@kontent-ai/model-generator-shared/testing";
import { migrationToolkitSnapshots } from "./snapshots.js";

runSnapshotTests([...migrationToolkitSnapshots]);
