import fs from 'fs';
import chalk from 'chalk';

const paths = ['dist'];
for (const path of paths) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
        console.log(`Path '${chalk.yellow(path)}' has been deleted`);
    }
}
