#!/usr/bin/env node
import chalk from 'chalk';

import { match } from 'ts-pattern';
import { logError } from '../core/error.utils.js';
import { deliveryActionAsync } from './actions/delivery-action.js';
import { environmentActionAsync } from './actions/environment-action.js';
import { itemsActionAsync } from './actions/items-action.js';
import { migrateActionAsync } from './actions/migrate-action.js';
import { argumentsFetcherAsync } from './args/args-fetcher.js';
import { cliArgs } from './commands.js';

// This enables --help with all commands, options & samples
cliArgs.registerCommands();

try {
    const argsFetcher = await argumentsFetcherAsync();

    await match(argsFetcher.getCliAction())
        .returnType<Promise<void>>()
        .with('delivery-sdk', async () => await deliveryActionAsync(argsFetcher))
        .with('migration-toolkit', async () => await migrateActionAsync(argsFetcher))
        .with('environment', async () => await environmentActionAsync(argsFetcher))
        .with('items', async () => await itemsActionAsync(argsFetcher))
        .otherwise((action) => {
            throw Error(`Invalid action '${chalk.red(action)}'`);
        });
} catch (error) {
    logError(error);
}
