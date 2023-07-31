import { TaxonomyTypeFileNameResolver, TaxonomyTypeResolver } from '../../models';
import { yellow } from 'colors';
import { commonHelper, IGeneratedFile } from '../../common-helper';
import { TaxonomyModels } from '@kontent-ai/management-sdk';
import {
    MapTaxonomyToFileName,
    MapTaxonomyName,
    getMapTaxonomyToFileName,
    getMapTaxonomyName
} from './delivery-mappers';

export class DeliveryTaxonomyGenerator {
    async generateTaxonomyTypesAsync(config: {
        outputDir: string;
        taxonomies: TaxonomyModels.Taxonomy[];
        taxonomyFolderName: string;
        addTimestamp: boolean;
        fileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): Promise<IGeneratedFile[]> {
        const files: IGeneratedFile[] = [];

        if (config.taxonomyResolver) {
            console.log(
                `Using '${yellow(
                    config.taxonomyResolver instanceof Function ? 'custom' : config.taxonomyResolver
                )}' name resolver for taxonomy type`
            );
        }

        if (config.fileResolver) {
            console.log(
                `Using '${yellow(
                    config.fileResolver instanceof Function ? 'custom' : config.fileResolver
                )}' name resolver for taxonomy filename`
            );
        }

        if (config.fileResolver || config.taxonomyResolver) {
            console.log('\n');
        }

        for (const taxonomy of config.taxonomies) {
            const file = this.generateModels({
                outputDir: config.outputDir,
                taxonomy: taxonomy,
                taxonomyFolderName: config.taxonomyFolderName,
                addTimestamp: config.addTimestamp,
                taxonomyNameMap: getMapTaxonomyName(config.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(config.fileResolver)
            });

            files.push(file);
        }

        return files;
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `${taxonomy.name}`;

        comment += `\n* Id: ${taxonomy.id}`;
        comment += `\n* Codename: ${taxonomy.codename}`;

        return comment;
    }

    private generateModels(data: {
        outputDir: string;
        taxonomy: TaxonomyModels.Taxonomy;
        taxonomyFolderName: string;
        addTimestamp: boolean;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        taxonomyNameMap: MapTaxonomyName;
    }): IGeneratedFile {
        const filename = `${data.outputDir}${data.taxonomyFolderName}${data.taxonomyFileNameMap(data.taxonomy, true)}`;
        const code = this.getModelCode({
            taxonomy: data.taxonomy,
            addTimestamp: data.addTimestamp,
            taxonomyNameMap: data.taxonomyNameMap
        });

        return {
            filename: filename,
            text: code
        };
    }

    private getModelCode(config: {
        taxonomyNameMap: MapTaxonomyName;
        taxonomy: TaxonomyModels.Taxonomy;
        addTimestamp: boolean;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(config.addTimestamp)}
*
* ${this.getTaxonomyComment(config.taxonomy)}
*/
export type ${config.taxonomyNameMap(config.taxonomy)} = ${this.getTaxonomyTermsCode(config.taxonomy)};
`;
        return code;
    }

    private getTaxonomyTermsCode(taxonomy: TaxonomyModels.Taxonomy): string {
        const taxonomyTermCodenames: string[] = [];
        this.getTaxonomyTermCodenames(taxonomy.terms, taxonomyTermCodenames);

        if (!taxonomyTermCodenames.length) {
            return `''`;
        }

        let code: string = '';

        const sortedTaxonomyTerms: string[] = commonHelper.sortAlphabetically(taxonomyTermCodenames, (item) => item);

        for (let i = 0; i < sortedTaxonomyTerms.length; i++) {
            const term = sortedTaxonomyTerms[i];
            const isLast = i === sortedTaxonomyTerms.length - 1;

            code += `'${term}'`;

            if (!isLast) {
                code += ` | `;
            }
        }

        return code;
    }

    private getTaxonomyTermCodenames(taxonomyTerms: TaxonomyModels.Taxonomy[], resolvedCodenames: string[]): void {
        for (const taxonomyTerm of taxonomyTerms) {
            if (!resolvedCodenames.includes(taxonomyTerm.codename)) {
                resolvedCodenames.push(taxonomyTerm.codename);
            }

            if (taxonomyTerm.terms.length) {
                this.getTaxonomyTermCodenames(taxonomyTerm.terms, resolvedCodenames);
            }
        }
    }
}

export const deliveryTaxonomylGenerator = new DeliveryTaxonomyGenerator();
