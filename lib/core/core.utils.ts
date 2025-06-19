export function uniqueFilter<T extends string>(value: T, index: number, self: readonly T[]): boolean {
	return self.indexOf(value) === index;
}

export const isNotUndefined = <T>(item: T | undefined): item is T => item !== undefined;

export function getFileNameWithoutExtension(filePath: string): string {
	if (!filePath.includes(".")) {
		return filePath;
	}
	return filePath.substring(0, filePath.lastIndexOf("."));
}

export function sortAlphabetically<T>(arrayToSort: readonly T[], propertySelector: (item: T) => string): readonly T[] {
	return arrayToSort.toSorted((a, b) => propertySelector(a).toLowerCase().localeCompare(propertySelector(b).toLowerCase()));
}

export function getStringOrUndefinedAsPropertyValue(text: string | undefined): string {
	return text ? `'${text}'` : "undefined";
}

export function toSafePropertyValue(value: string): string {
	return value.replace(/'/g, "");
}

export function toOutputDirPath(outputDir: string | undefined): string {
	return outputDir ? `${outputDir}/`.replaceAll("//", "/") : "./";
}

export function singleItemToArray<T>(item: T | undefined): readonly T[] {
	return item ? [item] : [];
}

export function findRequired<T>(array: readonly T[], predicate: (item: T, index: number) => boolean, errorMessage: string): T;
export function findRequired<T>(array: readonly T[], predicate: (item: T, index: number) => boolean, errorMessage: () => never): T;
export function findRequired<T>(
	array: readonly T[],
	predicate: (item: T, index: number) => boolean,
	errorMessage: string | (() => never),
): T {
	const item = array.find(predicate);

	if (item) {
		return item;
	}

	if (typeof errorMessage === "string" || errorMessage instanceof String) {
		throw new Error(errorMessage.toString());
	}
	return errorMessage();
}
