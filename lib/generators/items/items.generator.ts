import { IContentItem } from '@kontent-ai/delivery-sdk';
import { ContentTypeModels } from '@kontent-ai/management-sdk';
import Chalk from 'chalk';
import { itemsConfig } from '../../config.js';
import { toSafeComment, wrapComment } from '../../core/comment.utils.js';
import { GeneratedSet } from '../../core/core.models.js';
import { toPascalCase } from '../../core/core.utils.js';

export interface ItemGeneratorConfig {
    readonly environmentData: {
        readonly items: readonly Readonly<IContentItem>[];
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
    };
}

export function itemsGenerator(config: ItemGeneratorConfig) {
    const getItemCodenameType = (typeCodename: string, items: readonly Readonly<IContentItem>[]): string => {
        return `export type ${toPascalCase(typeCodename)}Codenames = ${items.map((item) => `'${item.system.codename}'`).join(' | ')};`;
    };

    const getItemCodenamesProp = (typeCodename: string, items: readonly Readonly<IContentItem>[]): string => {
        const values = items.reduce((code, item, index) => {
            const isLast = index === items.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${item.system.name}
                `)}
                ${item.system.codename}: {
                    codename: '${item.system.codename}',
                    id: '${item.system.id}'
                }${!isLast ? ',\n' : ''}`;
        }, '');

        return `export const ${typeCodename}Items = {
                    ${values}
                } as const;`;
    };

    const groupItemsByType = (items: readonly Readonly<IContentItem>[]): Map<string, readonly Readonly<IContentItem>[]> => {
        return items.reduce<Map<string, readonly Readonly<IContentItem>[]>>((itemsByType, item) => {
            const existingGroupItems = itemsByType.get(item.system.type);
            if (existingGroupItems) {
                itemsByType.set(item.system.type, [...existingGroupItems, item]);
            } else {
                itemsByType.set(item.system.type, [item]);
            }

            return itemsByType;
        }, new Map<string, readonly Readonly<IContentItem>[]>());
    };

    return {
        getItemFiles(): GeneratedSet {
            return {
                folderName: itemsConfig.itemsFolderName,
                files: Array.from(groupItemsByType(config.environmentData.items)).map(([typeCodename, items]) => {
                    const type = config.environmentData.types.find((t) => t.codename.toLowerCase() === typeCodename.toLowerCase());

                    if (!type) {
                        throw new Error(`Type with codename '${Chalk.red(typeCodename)}' not found`);
                    }

                    return {
                        filename: `${typeCodename}.items.ts`,
                        text: `
                    ${wrapComment(`\n * Object representing identifiers of available items
                   *
                    * ${toSafeComment(type.name)}
                    *
                    * Codename: ${type.codename}
                    * Id: ${type.id}
                    * Codename: ${typeCodename}\n`)}
                    ${getItemCodenamesProp(typeCodename, items)}`
                    };
                })
            };
        },
        getCodenameFiles(): GeneratedSet {
            return {
                folderName: itemsConfig.codenamesFolderName,
                files: Array.from(groupItemsByType(config.environmentData.items)).map(([typeCodename, items]) => {
                    const type = config.environmentData.types.find((t) => t.codename.toLowerCase() === typeCodename.toLowerCase());

                    if (!type) {
                        throw new Error(`Type with codename '${Chalk.red(typeCodename)}' not found`);
                    }

                    return {
                        filename: `${typeCodename}.codenames.ts`,
                        text: `
                    ${wrapComment(`\n * Type representing available item codenames
                    *
                    * ${toSafeComment(type.name)}
                    *
                    * Codename: ${type.codename}
                    * Id: ${type.id}
                    * Codename: ${typeCodename}\n`)}
                    ${getItemCodenameType(typeCodename, items)}`
                    };
                })
            };
        }
    };
}
