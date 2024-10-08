import chalk from 'chalk';

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
