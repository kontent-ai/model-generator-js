import chalk from 'chalk';
import fs from 'fs';
import { name, version } from '../package.json' with { type: 'json' };

const date = new Date();
const versionFilePath = './lib/meta/metadata.ts';
const versionProp = 'libMetadata';

createVersionFile(date, versionFilePath, versionProp);

function createVersionFile(date: Date, filePath: string, propertyName: string): void {
    console.log(chalk.cyan(`\nCreating version file at '${filePath}' with prop '${propertyName}'`));
    console.log(chalk.green(`Updating version ${chalk.yellow(version)}`));

    const src = `
export const ${propertyName} = {
    host: 'npmjs.com',
	name: '${name}',
    timestamp: '${date.toUTCString()}',
    version: '${version}'
};
`;

    console.log(`${chalk.green('Writing version to ')}${chalk.yellow(filePath)}\n`);
    fs.writeFileSync(filePath, src, { flag: 'w' });
}
