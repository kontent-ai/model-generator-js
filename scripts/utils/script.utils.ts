import chalk from 'chalk';
import * as dotenv from 'dotenv';
import fs, { rmSync } from 'fs';
import { parseModuleFileExtension } from '../../lib/cli/arg.utils.js';
import { ModuleFileExtension } from '../../lib/core/core.models.js';
import { logError } from '../../lib/core/error.utils.js';
import { getEnvironmentRequiredValue } from './test.utils.js';

export async function runScriptAsync(
    func: (config: {
        readonly managementApiKey: string;
        readonly deliveryApiKey: string;
        readonly environmentId: string;
        readonly moduleFileExtension: ModuleFileExtension;
    }) => Promise<void>
): Promise<void> {
    try {
        // needed to load .env environment to current process when run via package.json script
        dotenv.config();

        await func({
            deliveryApiKey: getEnvironmentRequiredValue('DELIVERY_API_KEY'),
            environmentId: getEnvironmentRequiredValue('ENVIRONMENT_ID'),
            managementApiKey: getEnvironmentRequiredValue('MANAGEMENT_API_KEY'),
            moduleFileExtension: parseModuleFileExtension(getEnvironmentRequiredValue('MODULE_EXTENSION'))
        });
    } catch (error) {
        logError(error);
    }
}

export function createVersionFile({
    date,
    filePath,
    propertyName,
    packageName,
    packageVersion
}: {
    readonly date: Date;
    readonly filePath: string;
    readonly propertyName: string;
    readonly packageName: string;
    readonly packageVersion: string;
}): void {
    console.log(chalk.cyan(`\nCreating version file at '${filePath}' with prop '${propertyName}'`));
    console.log(chalk.green(`Updating version ${chalk.yellow(packageVersion)}`));

    const src = `
export const ${propertyName} = {
    host: 'npmjs.com',
	name: '${packageName}',
    timestamp: '${date.toUTCString()}',
    version: '${packageVersion}'
};
`;

    console.log(`${chalk.green('Writing version to ')}${chalk.yellow(filePath)}\n`);
    fs.writeFileSync(filePath, src, { flag: 'w' });
}

export function deleteFolderRecursive(path: string): void {
    console.log(`Deleting existing folder '${chalk.yellow(path)}'`);
    rmSync(path, {
        recursive: true,
        force: true
    });

    console.log(`Folder '${chalk.yellow(path)}' deleted successfully`);
}
