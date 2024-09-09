import { camelCasePropertyNameResolver, pascalCasePropertyNameResolver, snakeCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';
import { createHash } from 'crypto';
import { CliAction, LibraryType, ModuleResolution } from './core.models.js';

export function uniqueFilter(value: string, index: number, self: readonly string[]): boolean {
    return self.indexOf(value) === index;
}

export function getCliAction(cliAction: CliAction): CliAction {
    return cliAction;
}

export function getLibrary(library: LibraryType): LibraryType {
    return library;
}

export function getModuleResolution(module: ModuleResolution): ModuleResolution {
    return module;
}

export function getDefaultModuleResolution(moduleResolution: ModuleResolution | undefined): ModuleResolution {
    return moduleResolution ?? 'node';
}

export function getFileNameWithoutExtension(filePath: string): string {
    return filePath.substring(0, filePath.lastIndexOf('.'));
}

export function getFilenameFromPath(text: string): string {
    const lastIndex = text.lastIndexOf('/');
    return text.substring(lastIndex + 1);
}

export function sortAlphabetically<T>(arrayToSort: readonly T[], propertySelector: (item: T) => string): readonly T[] {
    return arrayToSort.toSorted((a, b) => propertySelector(a).toLowerCase().localeCompare(propertySelector(b).toLowerCase()));
}

export function toPascalCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeStringCode(pascalCasePropertyNameResolver('', text));
}

export function toCamelCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeStringCode(camelCasePropertyNameResolver('', text));
}

export function toSnakeCase(text: string): string {
    // use element resolver from SDK to keep it consistent
    return toSafeStringCode(snakeCasePropertyNameResolver('', text));
}

export function toGuidelinesComment(guidelines: string): string {
    return removeLineEndings(guidelines);
}

export function getStringOrUndefined(text?: string): string {
    return text ? `'${text}'` : 'undefined';
}

export function toSafePropertyName(value: string): string {
    const replaceContent = '';
    const withoutNumbers = value.replace(/^\d+/, replaceContent);
    const propertyName = withoutNumbers
        .replace(/[\s-]/g, replaceContent)
        .replace(/[^a-zA-Z0-9_]/g, replaceContent)
        .toLowerCase();

    if (propertyName.length === 0) {
        // to prevent empty string being used as property name, use hash
        return getPropertyStringHash(value);
    }

    return propertyName;
}

export function toSafePropertyValue(value: string): string {
    const replaceContent = '';
    return value.replace(/'/g, replaceContent);
}

export function toOutputDirPath(outputDir?: string): string {
    return outputDir ? `${outputDir}/`.replaceAll('//', '/') : `./`;
}

function removeLineEndings(value: string): string {
    return value.replace(/(\r\n|\n|\r)/gm, '');
}

function toSafeStringCode(text: string): string {
    const replaceContent = '';
    return text.replace(/[\s-]/g, replaceContent).replace(/[^a-zA-Z0-9_]/g, replaceContent);
}

function getPropertyStringHash(text: string): string {
    const hash = createHash('sha256');
    hash.update(text);
    return `_${hash.digest('hex')}`.slice(0, 10);
}
