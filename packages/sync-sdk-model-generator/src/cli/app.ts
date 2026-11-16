#!/usr/bin/env node
import { runCliAsync } from "@kontent-ai/model-generator-shared";
import { syncCommand } from "./sync-command.js";

await runCliAsync([syncCommand]);
