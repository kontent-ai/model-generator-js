import {
    camelCasePropertyNameResolver,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver
} from '@kontent-ai/delivery-sdk';
import { ModuleResolution } from '../models.js';
import { LibraryType, LiteralUnion } from './index.js';

export function exitProgram(data: { readonly message: string }): never {
    throw Error(data.message);
}

export function uniqueFilter(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
}

export function replaceTsExtensionWithJs(filePath: string): string {
    return filePath.replace('.ts', '.js');
}

export function getFileNameWithoutExtension(filePath: string): string {
    const lastDotIndex = filePath.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return filePath;
    }
    return filePath.substring(0, lastDotIndex);
}

export function getImportStatement(data: {
    filePathOrPackage: LiteralUnion<LibraryType>;
    importValue: string;
    moduleResolution: ModuleResolution;
}): string {
    const isExternalLib = !data.filePathOrPackage.endsWith('.js') && !data.filePathOrPackage.endsWith('.ts');
    const resolvedFilePath =
        data.moduleResolution === 'nodeNext' && !isExternalLib
            ? `${getFileNameWithoutExtension(data.filePathOrPackage)}.js`
            : data.filePathOrPackage;

    return `import type { ${data.importValue} } from '${resolvedFilePath}';`;
}

export function toPascalCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeString(pascalCasePropertyNameResolver('', text), 'nothing');
}

export function toCamelCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeString(camelCasePropertyNameResolver('', text), 'nothing');
}

export function toSnakeCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeString(snakeCasePropertyNameResolver('', text), 'nothing');
}

export function toAlphanumeric(value: string): string {
    return value.replace(/\W/g, '');
}

export function removeLineEndings(value: string): string {
    return value.replace(/(\r\n|\n|\r)/gm, '');
}

export function toSafeString(text: string, replaceWith: 'space' | 'nothing' = 'nothing'): string {
    const replaceContent = replaceWith === 'space' ? ' ' : '';
    return text.replace(/[\s-]/g, replaceContent).replace(/[^a-zA-Z0-9_]/g, replaceContent);
}
