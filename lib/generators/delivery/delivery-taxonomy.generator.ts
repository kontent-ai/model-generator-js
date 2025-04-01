import type { EnvironmentModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { deliveryConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import type { TaxonomyNameResolver, TaxonomyTypeFileNameResolver } from '../../core/resolvers.js';
import { mapFilename, mapName } from '../../core/resolvers.js';

export interface DeliveryTaxonomyGeneratorConfig {
    readonly moduleFileExtension: ModuleFileExtension;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
    };

    readonly fileResolvers?: {
        readonly taxonomy?: TaxonomyTypeFileNameResolver;
    };
    readonly nameResolvers?: {
        readonly taxonomy?: TaxonomyNameResolver;
    };
}

export function deliveryTaxonomyGenerator(config: DeliveryTaxonomyGeneratorConfig) {
    const taxonomyFileNameMap = mapFilename(config.fileResolvers?.taxonomy);
    const taxonomyNameMap = mapName(config.nameResolvers?.taxonomy, 'pascalCase');
    const taxonomyValuesNameMap = mapName(config.nameResolvers?.taxonomy, 'camelCase', { suffix: 'Values' });
    const taxonomyTypeGuardFunctionName = mapName(config.nameResolvers?.taxonomy, 'pascalCase', {
        prefix: 'is'
    });

    const generateTaxonomyTypes = (): GeneratedSet => {
        return {
            folderName: deliveryConfig.taxonomiesFolderName,
            files: config.environmentData.taxonomies.map<GeneratedFile>((taxonomy) => {
                return getTaxonomyFile(taxonomy);
            })
        };
    };

    const getTaxonomyFile = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): GeneratedFile => {
        return {
            filename: taxonomyFileNameMap(taxonomy, true),
            text: getModelCode(taxonomy)
        };
    };

    const getTaxonomyTypeGuardFunction = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        return `export function ${taxonomyTypeGuardFunctionName(taxonomy)}(value: string | undefined | null): value is ${taxonomyNameMap(taxonomy)} {
                return typeof value === 'string' && (${taxonomyValuesNameMap(taxonomy)} as readonly string[]).includes(value);
            }`;
    };

    const getTaxonomyValuesCode = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        return `export const ${taxonomyValuesNameMap(taxonomy)} = [${getTaxonomyTermCodenames(taxonomy.terms)
            .map((m) => `'${m}'`)
            .join(', ')}] as const;`;
    };

    const getModelCode = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        return `

${wrapComment(`
 * All taxonomy codename values for ${taxonomy.name}
 * 
 * Codename: ${taxonomy.codename}
 * Id: ${taxonomy.id}
`)}
 ${getTaxonomyValuesCode(taxonomy)}

${wrapComment(`
 * Type representing ${taxonomy.name} taxonomy
 * 
 * Codename: ${taxonomy.codename}
 * Id: ${taxonomy.id}
`)}
export type ${taxonomyNameMap(taxonomy)} = typeof ${taxonomyValuesNameMap(taxonomy)}[number];

${wrapComment(`
 * Type guard for ${taxonomy.name}
 * 
 * Codename: ${taxonomy.codename}
 * Id: ${taxonomy.id}
`)}
${getTaxonomyTypeGuardFunction(taxonomy)}
`;
    };

    const getTaxonomyTermCodenames = (taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]): readonly string[] => {
        return taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
            return codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename);
        }, []);
    };

    return {
        generateTaxonomyTypes
    };
}
