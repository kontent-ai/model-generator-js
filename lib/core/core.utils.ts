export function uniqueFilter(value: string, index: number, self: readonly string[]): boolean {
    return self.indexOf(value) === index;
}

export const isNotUndefined = <T>(item: T | undefined): item is T => item !== undefined;

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

export function toGuidelinesComment(guidelines: string): string {
    return removeLineEndings(guidelines);
}

export function getStringOrUndefined(text: string | undefined): string {
    return text ? `'${text}'` : 'undefined';
}

export function toSafePropertyValue(value: string): string {
    const replaceWith = '';
    return value.replace(/'/g, replaceWith);
}

export function toOutputDirPath(outputDir: string | undefined): string {
    return outputDir ? `${outputDir}/`.replaceAll('//', '/') : `./`;
}

export function prefixWithUnderscoreWhenStartsWithNonAlpha(text: string): string {
    if (/^[^a-zA-Z]/.test(text)) {
        return `_${text.replace(/^_+/, '')}`;
    }
    return text;
}

export function singleItemToArray<T>(item: T | undefined): readonly T[] {
    return item ? [item] : [];
}

function removeLineEndings(value: string): string {
    return value.replace(/(\r\n|\n|\r)/g, '');
}
