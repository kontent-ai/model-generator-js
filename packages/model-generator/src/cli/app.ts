#!/usr/bin/env node
import { runCliAsync } from "@kontent-ai/model-generator-shared";
import { environmentCommand } from "./environment-command.js";
import { itemsCommand } from "./items-command.js";

await runCliAsync([environmentCommand, itemsCommand]);
