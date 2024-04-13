import {
    camelCasePropertyNameResolver,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver
} from '@kontent-ai/delivery-sdk';
import { DefaultResolverType } from './models.js';

export class TextHelper {
    resolveTextWithDefaultResolver(text: string, resolverType: DefaultResolverType): string {
        if (resolverType === 'camelCase') {
            return this.toCamelCase(text);
        }

        if (resolverType === 'pascalCase') {
            return this.toPascalCase(text);
        }

        if (resolverType === 'snakeCase') {
            return this.toSnakeCase(text);
        }

        throw Error(`Invalid name resolver '${resolverType}'. Available options are: camelCase, pascalCase, snakeCase`);
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
