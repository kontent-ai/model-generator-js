export function isArrayWithNonZeroItems<T>(items: readonly T[] | undefined): items is [T, ...T[]] {
	return (items?.length ?? 0) > 0;
}
