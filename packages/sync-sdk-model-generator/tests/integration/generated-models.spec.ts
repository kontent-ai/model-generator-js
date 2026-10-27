import { runSnapshotTests } from "@kontent-ai/model-generator-shared/testing";
import { syncSdkSnapshots } from "./snapshots.js";

runSnapshotTests([...syncSdkSnapshots]);
