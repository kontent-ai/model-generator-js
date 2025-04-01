import chalk from 'chalk';
import * as dotenv from 'dotenv';

// needed to load .env environment to current process when run via package.json script
dotenv.config();

export function getEnvironmentRequiredValue(variableName: string): string {
    const value = getEnvironmentOptionalValue(variableName);

    if (!value) {
        throw new Error(`Missing environment variable '${chalk.red(variableName)}'`);
    }

    return value;
}

export function getEnvironmentOptionalValue(variableName: string): string | undefined {
    return process.env?.[variableName];
}
