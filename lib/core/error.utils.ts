import { SharedModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { ErrorData, OriginalManagementError } from './core.models.js';

export function extractErrorData(error: unknown): ErrorData {
    let isUnknownError: boolean = true;
    let message: string = `Unknown error`;
    let requestUrl: string | undefined = undefined;
    let requestData: string | undefined = undefined;

    if (error instanceof SharedModels.ContentManagementBaseKontentError) {
        isUnknownError = false;
        const originalError = error.originalError as OriginalManagementError | undefined;

        requestUrl = originalError?.response?.config?.url;
        requestData = originalError?.response?.config?.data;

        message = `${error.message}: ${error.validationErrors.map((m) => m.message).join(', ')}`;
    } else if (error instanceof Error) {
        message = error.message;
    }

    const errorData: ErrorData = {
        message: message,
        requestData: requestData,
        requestUrl: requestUrl,
        error: error,
        isUnknownError: isUnknownError
    };

    return errorData;
}

export function is404Error(error: unknown): boolean {
    if (error instanceof SharedModels.ContentManagementBaseKontentError) {
        const originalError = error.originalError as OriginalManagementError | undefined;

        if (originalError?.response?.status === 404) {
            return true;
        }
    }

    return false;
}

export function handleError(error: unknown): void {
    const errorData = extractErrorData(error);

    if (errorData.isUnknownError) {
        console.error(error);
    }

    if (errorData.requestData) {
        console.log(`${chalk.red('Request data')}: ${errorData.requestData}`);
    }

    if (errorData.requestUrl) {
        console.log(`${chalk.red('Request url')}: ${errorData.requestUrl}`);
    }

    console.error(`${chalk.red('Error:')} ${errorData.message}`);
}
