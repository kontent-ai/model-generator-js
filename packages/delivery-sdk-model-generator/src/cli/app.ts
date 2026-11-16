#!/usr/bin/env node
import { runCliAsync } from "@kontent-ai/model-generator-shared";
import { deliveryCommand } from "./delivery-command.js";

await runCliAsync([deliveryCommand]);
