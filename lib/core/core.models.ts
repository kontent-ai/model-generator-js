import { IManagementClient } from '@kontent-ai/management-sdk';

export type CliAction = 'delivery' | 'migration';
export type LibraryType = '@kontent-ai/migration-toolkit';

export type GeneratorManagementClient = Readonly<IManagementClient<unknown>>;

export type LiteralUnion<T extends string> = T | (string & NonNullable<unknown>);

export interface ErrorData {
    readonly message: string;
    readonly requestData?: string;
    readonly requestUrl?: string;
    readonly isUnknownError: boolean;
    readonly error: unknown;
}

export interface OriginalManagementError {
    readonly response?: {
        readonly status?: number;
        readonly config?: {
            readonly url?: string;
            readonly data?: string;
        };
        readonly data?: {
            readonly error_code?: number;
        };
    };
}
