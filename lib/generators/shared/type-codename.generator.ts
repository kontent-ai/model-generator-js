import type { ObjectWithCodename } from "../../core/core.models.js";
import { sortAlphabetically, uniqueFilter } from "../../core/core.utils.js";

export function getTypeWithCodenames(typeName: string, items: readonly ObjectWithCodename[]): string {
	if (!items.length) {
		return `export type ${typeName} = never`;
	}
	return `export type ${typeName} = ${sortAlphabetically(items.map((item) => `'${item.codename}'`).filter(uniqueFilter), (m) => m).join(
		" | ",
	)};`;
}
