import { DefaultResolverType } from './models.js';
export declare class TextHelper {
    resolveTextWithDefaultResolver(text: string, resolverType: DefaultResolverType): string;
    toPascalCase(text: string): string;
    toCamelCase(text: string): string;
    toSnakeCase(text: string): string;
    toAlphanumeric(value: string): string;
    removeLineEndings(value: string): string;
    toSafeName(text: string, replaceWith: 'space' | 'nothing'): string;
}
export declare const textHelper: TextHelper;
