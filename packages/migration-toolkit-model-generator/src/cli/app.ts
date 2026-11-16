#!/usr/bin/env node
import { runCliAsync } from "@kontent-ai/model-generator-shared";
import { migrateCommand } from "./migrate-command.js";

await runCliAsync([migrateCommand]);
