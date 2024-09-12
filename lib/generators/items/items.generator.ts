import { ContentItemModels, ContentTypeModels, EnvironmentModels } from '@kontent-ai/management-sdk';
import { itemsConfig } from '../../config.js';
import { toSafeComment, wrapComment } from '../../core/comment.utils.js';
import { GeneratedFile, ModuleResolution } from '../../core/core.models.js';
import { toPascalCase } from '../../core/core.utils.js';

export interface ItemGeneratorConfig {
    readonly moduleResolution: ModuleResolution;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly items: readonly Readonly<ContentItemModels.ContentItem>[];
    };
}

export function itemsGenerator(config: ItemGeneratorConfig) {
    const getItemCodenameType = (
        type: Readonly<ContentTypeModels.ContentType>,
        items: readonly Readonly<ContentItemModels.ContentItem>[]
    ): string => {
        return `export type ${toPascalCase(type.codename)}Codenames = ${items.map((item) => `'${item.codename}'`).join(' | ')};`;
    };

    const getItemCodenamesProp = (
        type: Readonly<ContentTypeModels.ContentType>,
        items: readonly Readonly<ContentItemModels.ContentItem>[]
    ): string => {
        const values = items.reduce((code, item, index) => {
            const isLast = index === items.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${item.name}
                `)}
                ${item.codename}: {
                    codename: '${item.codename}',
                    id: '${item.id}'
                }${!isLast ? ',\n' : ''}`;
        }, '');

        return `export const ${type.codename}Items = {
                    ${values}
                } as const;`;
    };

    return {
        getItemFiles(): readonly GeneratedFile[] {
            return config.environmentData.types.map((type) => {
                const typeItems = config.environmentData.items.filter((m) => m.type.id === type.id);

                return {
                    filename: `${itemsConfig.itemsFolderName}/${type.codename}.items.ts`,
                    text: `
                    ${wrapComment(`\n * Object representing identifiers of available items
                    *
                    * ${toSafeComment(type.name)}
                    *
                    * Codename: ${type.codename}
                    * Id: ${type.id}\n`)}
                    ${getItemCodenamesProp(type, typeItems)}`
                };
            });
        },
        getCodenameFiles(): readonly GeneratedFile[] {
            return config.environmentData.types.map((type) => {
                const typeItems = config.environmentData.items.filter((m) => m.type.id === type.id);

                return {
                    filename: `${itemsConfig.codenamesFolderName}/${type.codename}.codenames.ts`,
                    text: `
                    ${wrapComment(`\n * Type representing available item codenames
                    *
                    * ${toSafeComment(type.name)}
                    *
                    * Codename: ${type.codename}
                    * Id: ${type.id}\n`)}
                    ${getItemCodenameType(type, typeItems)}`
                };
            });
        }
    };
}
