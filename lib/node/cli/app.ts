#!/usr/bin/env node
import chalk from 'chalk';

import { match } from 'ts-pattern';
import { handleError } from '../../core/index.js';
import { deliveryActionAsync } from './actions/delivery-action.js';
import { environmentActionAsync } from './actions/environment-action.js';
import { migrateActionAsync } from './actions/migrate-action.js';
import { argumentsFetcherAsync } from './args/args-fetcher.js';
import { cliArgs } from './commands.js';

// This enabled --help with all commands, options & samples
cliArgs.registerCommands();

const run = async () => {
    const argsFetcher = await argumentsFetcherAsync();

    return match(argsFetcher.getCliAction())
        .returnType<Promise<void>>()
        .with('delivery-sdk', async () => await deliveryActionAsync(argsFetcher))
        .with('migration-toolkit', async () => await migrateActionAsync(argsFetcher))
        .with('environment', async () => await environmentActionAsync(argsFetcher))
        .otherwise((action) => {
            throw Error(`Invalid action '${chalk.red(action)}'`);
        });
};

run().catch((err) => {
    handleError(err);
});
