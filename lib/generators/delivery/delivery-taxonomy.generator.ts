import { format, Options } from 'prettier';
import * as fs from 'fs';
import { TaxonomyTypeFileNameResolver, TaxonomyTypeResolver } from '../../models';
import { yellow } from 'colors';
import { commonHelper, IGenerateResult } from '../../common-helper';
import { TaxonomyModels } from '@kentico/kontent-management';
import {
    MapTaxonomyToFileName,
    MapTaxonomyName,
    getMapTaxonomyToFileName,
    getMapTaxonomyName
} from './delivery-name-mappers';

export class DeliveryTaxonomyGenerator {
    async generateTaxonomyTypesAsync(config: {
        taxonomies: TaxonomyModels.Taxonomy[];
        addTimestamp: boolean;
        formatOptions?: Options;
        fileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): Promise<IGenerateResult> {
        const filenames: string[] = [];

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
            const filename = this.generateModels({
                taxonomy: taxonomy,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                taxonomyNameMap: getMapTaxonomyName(config.taxonomyResolver),
                taxonomyFileNameMap: getMapTaxonomyToFileName(config.fileResolver)
            });
            filenames.push(filename);
            console.log(`${yellow(getMapTaxonomyToFileName(config.fileResolver)(taxonomy, true))} (${taxonomy.name})`);
        }

        return {
            filenames: filenames
        };
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `${taxonomy.name}`;

        comment += `\n* Id: ${taxonomy.id}`;
        comment += `\n* Codename: ${taxonomy.codename}`;

        return comment;
    }

    private generateModels(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        addTimestamp: boolean;
        formatOptions?: Options;
        taxonomyFileNameMap: MapTaxonomyToFileName;
        taxonomyNameMap: MapTaxonomyName;
    }): string {
        const classFileName = data.taxonomyFileNameMap(data.taxonomy, true);
        const filename = './' + classFileName;
        const code = this.getModelCode({
            taxonomy: data.taxonomy,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            taxonomyNameMap: data.taxonomyNameMap
        });

        fs.writeFileSync(filename, code);
        return filename;
    }

    private getModelCode(config: {
        taxonomyNameMap: MapTaxonomyName;
        taxonomy: TaxonomyModels.Taxonomy;
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(config.addTimestamp)}
*
* ${this.getTaxonomyComment(config.taxonomy)}
*/
export type ${config.taxonomyNameMap(config.taxonomy)} = ${this.getTaxonomyTermsCode(config.taxonomy)};
`;
        const formatOptions: Options = config.formatOptions
            ? config.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    private getTaxonomyTermsCode(taxonomy: TaxonomyModels.Taxonomy): string {
        const taxonomyTermCodenames: string[] = [];
        this.getTaxonomyTermCodenames(taxonomy.terms, taxonomyTermCodenames);

        if (!taxonomyTermCodenames.length) {
            return `''`;
        }

        let code: string = '';

        for (let i = 0; i < taxonomyTermCodenames.length; i++) {
            const term = taxonomyTermCodenames[i];
            const isLast = i === taxonomyTermCodenames.length - 1;

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
