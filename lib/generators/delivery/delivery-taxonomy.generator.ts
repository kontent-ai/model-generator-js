import { EnvironmentModels, TaxonomyModels } from '@kontent-ai/management-sdk';

import { deliveryConfig } from '../../config.js';
import {
    GeneratedFile,
    mapFilename,
    mapName,
    ModuleResolution,
    sortAlphabetically,
    TaxonomyNameResolver,
    TaxonomyTypeFileNameResolver,
    wrapComment
} from '../../core/index.js';

export interface DeliveryTaxonomyGeneratorConfig {
    readonly moduleResolution: ModuleResolution;

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

    const generateTaxonomyTypes = (): readonly GeneratedFile[] => {
        return config.environmentData.taxonomies.map<GeneratedFile>((taxonomy) => {
            return getTaxonomyFile(taxonomy);
        });
    };

    const getTaxonomyFile = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): GeneratedFile => {
        return {
            filename: `${deliveryConfig.taxonomiesFolderName}/${taxonomyFileNameMap(taxonomy, true)}`,
            text: getModelCode(taxonomy)
        };
    };

    const getModelCode = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        return `
${wrapComment(`
 * ${taxonomy.name}
 * 
 * Codename: ${taxonomy.codename}
 * Id: ${taxonomy.id}
`)}
export type ${taxonomyNameMap(taxonomy)} = ${getTaxonomyTermsCode(taxonomy)};
`;
    };

    const getTaxonomyTermsCode = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        const taxonomyTermCodenames = sortAlphabetically(getTaxonomyTermCodenames(taxonomy.terms), (codename) => codename);

        if (!taxonomyTermCodenames.length) {
            return `''`;
        }

        return taxonomyTermCodenames.reduce<string>((code, codename, index) => {
            const isLast = index === taxonomyTermCodenames.length - 1;
            return `${code} '${codename}'${isLast ? '' : ' | '}`;
        }, '');
    };

    const getTaxonomyTermCodenames = (taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]): readonly string[] => {
        return taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
            return sortAlphabetically(
                codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename),
                (codename) => codename
            );
        }, []);
    };

    return {
        generateTaxonomyTypes
    };
}
