import { runSnapshotTests } from "@kontent-ai/model-generator-shared/testing";
import { deliverySdkSnapshots } from "./snapshots.js";

runSnapshotTests([...deliverySdkSnapshots]);
