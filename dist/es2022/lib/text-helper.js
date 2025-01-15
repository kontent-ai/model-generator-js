import { camelCasePropertyNameResolver, pascalCasePropertyNameResolver, snakeCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';
export class TextHelper {
    resolveTextWithDefaultResolver(text, resolverType) {
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
    toPascalCase(text) {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(pascalCasePropertyNameResolver('', text), 'nothing');
    }
    toCamelCase(text) {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(camelCasePropertyNameResolver('', text), 'nothing');
    }
    toSnakeCase(text) {
        // use element resolver from SDK as it provides required functionality
        return this.toSafeName(snakeCasePropertyNameResolver('', text), 'nothing');
    }
    toAlphanumeric(value) {
        return value.replace(/\W/g, '');
    }
    removeLineEndings(value) {
        return value.replace(/(\r\n|\n|\r)/gm, '');
    }
    toSafeName(text, replaceWith) {
        const replaceContent = replaceWith === 'space' ? ' ' : '';
        return text.replace(/[\s-]/g, replaceContent).replace(/[^a-zA-Z0-9_]/g, replaceContent);
    }
}
export const textHelper = new TextHelper();
//# sourceMappingURL=text-helper.js.map