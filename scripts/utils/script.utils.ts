import chalk from 'chalk';
import fs, { rmSync } from 'fs';
import { parseModuleFileExtension } from '../../lib/cli/arg.utils.js';
import type { ModuleFileExtension } from '../../lib/core/core.models.js';
import { logError } from '../../lib/core/error.utils.js';
import { getEnvironmentRequiredValue } from './environment.utils.js';

export async function runScriptAsync(
    func: (config: {
        readonly sampleEnv: {
            readonly managementApiKey: string;
            readonly deliveryApiKey: string;
            readonly environmentId: string;
        };
        readonly integrationEnv: {
            readonly managementApiKey: string;
            readonly environmentId: string;
        };

        readonly moduleFileExtension: ModuleFileExtension;
    }) => Promise<void>
): Promise<void> {
    try {
        await func({
            sampleEnv: {
                deliveryApiKey: getEnvironmentRequiredValue('SAMPLE_DELIVERY_API_KEY'),
                environmentId: getEnvironmentRequiredValue('SAMPLE_ENVIRONMENT_ID'),
                managementApiKey: getEnvironmentRequiredValue('SAMPLE_MANAGEMENT_API_KEY')
            },
            integrationEnv: {
                environmentId: getEnvironmentRequiredValue('INTEGRATION_ENVIRONMENT_ID'),
                managementApiKey: getEnvironmentRequiredValue('INTEGRATION_MANAGEMENT_API_KEY')
            },
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
