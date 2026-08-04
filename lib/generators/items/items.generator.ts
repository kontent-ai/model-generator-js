import { colorize } from "@kontent-ai/core-sdk/devkit";
import type { ContentTypeModels } from "@kontent-ai/management-sdk";
import { itemsConfig } from "../../config.js";
import { wrapComment } from "../../core/comment.utils.js";
import type { GeneratedSet, GeneratorContentItem } from "../../core/core.models.js";
import { resolveCase } from "../../core/resolvers.js";

export interface ItemGeneratorConfig {
	readonly disableComments: boolean;
	readonly environmentData: {
		readonly items: readonly Readonly<GeneratorContentItem>[];
		readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
	};
}

export function getItemsGenerator(config: ItemGeneratorConfig) {
	const getItemCodenameType = (typeCodename: string, items: readonly Readonly<GeneratorContentItem>[]): string => {
		return `export type ${resolveCase(typeCodename, "pascalCase")}Codenames = ${items.map((item) => `'${item.system.codename}'`).join(" | ")};`;
	};

	const getItemCodenamesProp = (typeCodename: string, items: readonly Readonly<GeneratorContentItem>[]): string => {
		const values = items.reduce((code, item, index) => {
			const isLast = index === items.length - 1;

			return `${code}\n
                ${wrapComment(item.system.name, { disableComments: config.disableComments })}
                ${item.system.codename}: {
                    codename: '${item.system.codename}',
                    id: '${item.system.id}'
                }${!isLast ? ",\n" : ""}`;
		}, "");

		return `export const ${typeCodename}Items = {
                    ${values}
                } as const;`;
	};

	const groupItemsByType = (items: readonly Readonly<GeneratorContentItem>[]): Map<string, readonly Readonly<GeneratorContentItem>[]> => {
		return items.reduce<Map<string, readonly Readonly<GeneratorContentItem>[]>>((itemsByType, item) => {
			const existingGroupItems = itemsByType.get(item.system.type);
			if (existingGroupItems) {
				itemsByType.set(item.system.type, [...existingGroupItems, item]);
			} else {
				itemsByType.set(item.system.type, [item]);
			}

			return itemsByType;
		}, new Map<string, readonly Readonly<GeneratorContentItem>[]>());
	};

	return {
		getItemFiles(): GeneratedSet {
			return {
				folderName: itemsConfig.itemsFolderName,
				files: Array.from(groupItemsByType(config.environmentData.items)).map(([typeCodename, items]) => {
					const type = config.environmentData.types.find((t) => t.codename.toLowerCase() === typeCodename.toLowerCase());

					if (!type) {
						throw new Error(`Type with codename '${colorize("red", typeCodename)}' not found`);
					}

					return {
						filename: `${typeCodename}.items.ts`,
						text: `${wrapComment("Object representing identifiers of available items", {
							disableComments: config.disableComments,
							lines: [
								{
									name: "Type name",
									value: type.name,
								},
								{
									name: "Codename",
									value: type.codename,
								},
								{
									name: "Id",
									value: type.id,
								},
							],
						})}
                    ${getItemCodenamesProp(typeCodename, items)}`,
					};
				}),
			};
		},
		getCodenameFiles(): GeneratedSet {
			return {
				folderName: itemsConfig.codenamesFolderName,
				files: Array.from(groupItemsByType(config.environmentData.items)).map(([typeCodename, items]) => {
					const type = config.environmentData.types.find((t) => t.codename.toLowerCase() === typeCodename.toLowerCase());

					if (!type) {
						throw new Error(`Type with codename '${colorize("red", typeCodename)}' not found`);
					}

					return {
						filename: `${typeCodename}.codenames.ts`,
						text: `${wrapComment("Type representing available item codenames", {
							disableComments: config.disableComments,
							lines: [
								{
									name: "Type name",
									value: type.name,
								},
								{
									name: "Type codename",
									value: type.codename,
								},
							],
						})}
                    ${getItemCodenameType(typeCodename, items)}`,
					};
				}),
			};
		},
	};
}
