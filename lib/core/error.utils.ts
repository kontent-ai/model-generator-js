import { SharedModels } from '@kontent-ai/management-sdk';
import chalk from 'chalk';
import { match, P } from 'ts-pattern';
import type { ErrorData, OriginalManagementError } from './core.models.js';

export function logError(error: unknown): void {
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

export function extractErrorData(error: unknown): ErrorData {
    return match(error)
        .returnType<ErrorData>()
        .with(P.instanceOf(SharedModels.ContentManagementBaseKontentError), (error) => {
            const originalError = error.originalError as OriginalManagementError | undefined;
            const validationErrorMessage = error.validationErrors.length
                ? `: ${error.validationErrors.map((m) => m.message).join(', ')}`
                : '';

            return {
                message: `${error.message}${validationErrorMessage}`,
                requestData: originalError?.response?.config?.data,
                requestUrl: originalError?.response?.config?.url,
                error: error,
                isUnknownError: false,
                isMapiError: true
            };
        })
        .with(P.instanceOf(Error), (error) => {
            return {
                message: error.message,
                requestData: undefined,
                requestUrl: undefined,
                error: error,
                isUnknownError: true,
                isMapiError: false
            };
        })
        .otherwise(() => {
            return {
                message: `Unknown error`,
                requestData: undefined,
                requestUrl: undefined,
                error: error,
                isUnknownError: true,
                isMapiError: false
            };
        });
}
