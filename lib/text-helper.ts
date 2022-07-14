import {
    camelCasePropertyNameResolver,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver
} from '@kontent-ai/delivery-sdk';
import { DefaultResolverType } from './models';

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
        return pascalCasePropertyNameResolver('', text);
    }

    toCamelCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return camelCasePropertyNameResolver('', text);
    }

    toSnakeCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return snakeCasePropertyNameResolver('', text);
    }

    toAlphanumeric(value: string): string {
        return value.replace(/\W/g, '');
    }

    removeLineEndings(value: string): string {
        return value.replace(/(\r\n|\n|\r)/gm, '');
    }
}

export const textHelper = new TextHelper();
