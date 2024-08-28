import { ModuleResolution, TaxonomyTypeResolver } from '../../models.js';
import chalk from 'chalk';
import { EnvironmentModels, TaxonomyModels } from '@kontent-ai/management-sdk';

import {
    GeneratedFile,
    getMapTaxonomyName,
    getMapTaxonomyToFileName,
    MapTaxonomyName,
    MapTaxonomyToFileName,
    sortAlphabetically,
    TaxonomyTypeFileNameResolver,
    toSafeString
} from '../../core/index.js';
import { commentsManager as _commentsManager } from '../../comments/index.js';

export interface DeliveryTaxonomyGeneratorConfig {
    readonly addTimestamp: boolean;
    readonly moduleResolution: ModuleResolution;
    readonly fileResolver?: TaxonomyTypeFileNameResolver;
    readonly taxonomyResolver?: TaxonomyTypeResolver;
    readonly taxonomyFolderName: string;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
    };
}

export function deliveryTaxonomyGenerator(config: DeliveryTaxonomyGeneratorConfig) {
    const commentsManager = _commentsManager(config.addTimestamp);

    const generateTaxonomyTypes = (): readonly GeneratedFile[] => {
        if (config.taxonomyResolver) {
            console.log(
                `Using '${chalk.yellow(
                    config.taxonomyResolver instanceof Function ? 'custom' : config.taxonomyResolver
                )}' name resolver for taxonomy type`
            );
        }

        if (config.fileResolver) {
            console.log(
                `Using '${chalk.yellow(
                    config.fileResolver instanceof Function ? 'custom' : config.fileResolver
                )}' name resolver for taxonomy filename`
            );
        }

        if (config.fileResolver || config.taxonomyResolver) {
            console.log('\n');
        }

        return config.environmentData.taxonomies.map<GeneratedFile>((taxonomy) => {
            return getTaxonomyFile({
                taxonomy: taxonomy,
                taxonomyFileNameMap: getMapTaxonomyToFileName(config.fileResolver),
                taxonomyNameMap: getMapTaxonomyName(config.taxonomyResolver)
            });
        });
    };

    const getTaxonomyFile = (data: {
        readonly taxonomy: Readonly<TaxonomyModels.Taxonomy>;
        readonly taxonomyFileNameMap: MapTaxonomyToFileName;
        readonly taxonomyNameMap: MapTaxonomyName;
    }): GeneratedFile => {
        const filename = `${config.taxonomyFolderName}/${data.taxonomyFileNameMap(data.taxonomy, true)}`;
        const code = getModelCode({
            taxonomy: data.taxonomy,
            taxonomyNameMap: data.taxonomyNameMap
        });

        return {
            filename: filename,
            text: code
        };
    };

    const getModelCode = (data: {
        readonly taxonomyNameMap: MapTaxonomyName;
        readonly taxonomy: Readonly<TaxonomyModels.Taxonomy>;
    }): string => {
        return `
${commentsManager.environmentInfo(config.environmentData.environment)}

/**
 * ${toSafeString(data.taxonomy.name)}
 * 
 * Codename: ${data.taxonomy.codename}
 * Id: ${data.taxonomy.id}
 */
export type ${data.taxonomyNameMap(data.taxonomy)} = ${getTaxonomyTermsCode(data.taxonomy)};
`;
    };

    const getTaxonomyTermsCode = (taxonomy: Readonly<TaxonomyModels.Taxonomy>): string => {
        const taxonomyTermCodenames = sortAlphabetically(
            getTaxonomyTermCodenames(taxonomy.terms),
            (codename) => codename
        );

        if (!taxonomyTermCodenames.length) {
            return `''`;
        }

        return taxonomyTermCodenames.reduce<string>((code, codename, index) => {
            const isLast = index === taxonomyTermCodenames.length - 1;
            return `${code} '${codename}'${isLast ? '' : ' | '}`;
        }, '');
    };

    const getTaxonomyTermCodenames = (
        taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]
    ): readonly string[] => {
        return taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
            return codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename);
        }, []);
    };

    return {
        generateTaxonomyTypes
    };
}
