import Colors from 'colors';
import { commonHelper } from '../../common-helper.js';
import { getMapTaxonomyToFileName, getMapTaxonomyName } from './delivery-mappers.js';
export class DeliveryTaxonomyGenerator {
    async generateTaxonomyTypesAsync(config) {
        const files = [];
        if (config.taxonomyResolver) {
            console.log(`Using '${Colors.yellow(config.taxonomyResolver instanceof Function ? 'custom' : config.taxonomyResolver)}' name resolver for taxonomy type`);
        }
        if (config.fileResolver) {
            console.log(`Using '${Colors.yellow(config.fileResolver instanceof Function ? 'custom' : config.fileResolver)}' name resolver for taxonomy filename`);
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
    getTaxonomyComment(taxonomy) {
        let comment = `${taxonomy.name}`;
        comment += `\n* Id: ${taxonomy.id}`;
        comment += `\n* Codename: ${taxonomy.codename}`;
        return comment;
    }
    generateModels(data) {
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
    getModelCode(config) {
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
    getTaxonomyTermsCode(taxonomy) {
        const taxonomyTermCodenames = [];
        this.getTaxonomyTermCodenames(taxonomy.terms, taxonomyTermCodenames);
        if (!taxonomyTermCodenames.length) {
            return `''`;
        }
        let code = '';
        const sortedTaxonomyTerms = commonHelper.sortAlphabetically(taxonomyTermCodenames, (item) => item);
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
    getTaxonomyTermCodenames(taxonomyTerms, resolvedCodenames) {
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
//# sourceMappingURL=delivery-taxonomy.generator.js.map