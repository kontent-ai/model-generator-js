#!/usr/bin/env node
import chalk from 'chalk';

import { exitProgram, handleError } from '../../core/index.js';
import { deliveryActionAsync } from './actions/delivery-action.js';
import { migrateActionAsync } from './actions/migrate-action.js';
import { argumentsFetcherAsync } from './args/args-fetcher.js';
import { cliArgs } from './commands.js';

// This enabled --help with all commands, options & samples
cliArgs.registerCommands();

const run = async () => {
    const argsFetcher = await argumentsFetcherAsync();
    const action = argsFetcher.getCliAction();

    if (action === 'delivery') {
        return await deliveryActionAsync(argsFetcher);
    }

    if (action === 'migration') {
        return await migrateActionAsync(argsFetcher);
    }

    exitProgram({
        message: `Invalid action '${chalk.red(action)}'`
    });
};

run().catch((err) => {
    handleError(err);
});
