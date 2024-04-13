import fs from 'fs';
import Colors from 'colors';
import PackageJson from '../package.json' assert { type: 'json' };

export const createVersionFile = (date: Date, versionPath: string, propertyName: string) => {
    console.log(Colors.cyan(`\nCreating version file at '${versionPath}' with prop '${propertyName}'`));
    createFile(date, versionPath, propertyName);
};

function createFile(date: Date, filePath: string, propName: string) {
    const timestamp = date.toUTCString();

    const src = `
export const ${propName} = {
	name: '${PackageJson.name}',
    timestamp: '${timestamp}',
    version: '${PackageJson.version}'
};
`;

    fs.writeFile(filePath, src, { flag: 'w' }, (err) => {
        if (err) {
            return console.log(Colors.red(err.message));
        }

        console.log(Colors.green(`Updating version ${Colors.yellow(PackageJson.version)}`));
        console.log(`${Colors.green('Writing version to ')}${Colors.yellow(filePath)}\n`);
    });
}
