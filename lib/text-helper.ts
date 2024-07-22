import {
    camelCasePropertyNameResolver,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver
} from '@kontent-ai/delivery-sdk';
import { DefaultResolverType } from './models.js';

export class TextHelper {
    resolveTextWithDefaultResolver(text: string, resolverType: DefaultResolverType): string {
        switch (resolverType) {
            case 'camelCase':
                return this.toCamelCase(text);
            case 'pascalCase':
                return this.toPascalCase(text);
            case 'snakeCase':
                return this.toSnakeCase(text);
            default:
                throw Error(`Invalid name resolver. Available options are: camelCase, pascalCase, snakeCase`);
        }
    }

    toPascalCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(pascalCasePropertyNameResolver('', text), 'nothing');
    }

    toCamelCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(camelCasePropertyNameResolver('', text), 'nothing');
    }

    toSnakeCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(snakeCasePropertyNameResolver('', text), 'nothing');
    }

    toAlphanumeric(value: string): string {
        return value.replace(/\W/g, '');
    }

    removeLineEndings(value: string): string {
        return value.replace(/(\r\n|\n|\r)/gm, '');
    }

    toSafeName(text: string, replaceWith: 'space' | 'nothing'): string {
        const replaceContent = replaceWith === 'space' ? ' ' : '';
        return text.replace(/[\s-]/g, replaceContent).replace(/[^a-zA-Z0-9_]/g, replaceContent);
    }
}

export const textHelper = new TextHelper();
