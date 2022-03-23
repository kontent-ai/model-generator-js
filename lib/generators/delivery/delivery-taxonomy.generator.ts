import { ITaxonomyGroup, ITaxonomyTerms } from '@kentico/kontent-delivery';
import { format, Options } from 'prettier';
import * as fs from 'fs';
import { textHelper } from '../../text-helper';
import { TaxonomyTypeFileNameResolver, TaxonomyTypeResolver } from '../../models';
import { yellow } from 'colors';
import { commonHelper } from '../../common-helper';

export class DeliveryTaxonomyGenerator {
    async generateTaxonomyTypesAsync(config: {
        taxonomies: ITaxonomyGroup[];
        addTimestamp: boolean;
        formatOptions?: Options;
        fileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): Promise<void> {
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
            this.generateModels({
                taxonomy: taxonomy,
                addTimestamp: config.addTimestamp,
                formatOptions: config.formatOptions,
                taxonomyResolver: config.taxonomyResolver,
                fileResolver: config.fileResolver
            });
            console.log(
                `${yellow(this.getModelFilename({ taxonomy: taxonomy, fileResolver: config.fileResolver }))} (${
                    taxonomy.system.name
                })`
            );
        }
    }

    private generateModels(data: {
        taxonomy: ITaxonomyGroup;
        addTimestamp: boolean;
        formatOptions?: Options;
        fileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): void {
        const classFileName = this.getModelFilename({ taxonomy: data.taxonomy, fileResolver: data.fileResolver });
        const code = this.getModelCode({
            taxonomy: data.taxonomy,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            taxonomyResolver: data.taxonomyResolver
        });

        fs.writeFileSync('./' + classFileName, code);
    }

    private getModelFilename(data: { taxonomy: ITaxonomyGroup; fileResolver?: TaxonomyTypeFileNameResolver }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.taxonomy)}.ts`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.taxonomy.system.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(
                data.taxonomy.system.codename,
                data.fileResolver
            )}`;
        }

        return `${filename}.taxonomy.ts`;
    }

    private getModelCode(config: {
        taxonomy: ITaxonomyGroup;
        addTimestamp: boolean;
        formatOptions?: Options;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): string {
        const code = `
/**
 * ${commonHelper.getAutogenerateNote(config.addTimestamp)}
*/
export type ${this.getTaxonomyTypeName({
            taxonomy: config.taxonomy,
            taxonomyResolver: config.taxonomyResolver
        })} = ${this.getTaxonomyTermsCode(config.taxonomy)};
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

    private getTaxonomyTermsCode(taxonomy: ITaxonomyGroup): string {
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

    private getTaxonomyTermCodenames(taxonomyTerms: ITaxonomyTerms[], resolvedCodenames: string[]): void {
        for (const taxonomyTerm of taxonomyTerms) {
            if (!resolvedCodenames.includes(taxonomyTerm.codename)) {
                resolvedCodenames.push(taxonomyTerm.codename);
            }

            if (taxonomyTerm.terms.length) {
                this.getTaxonomyTermCodenames(taxonomyTerm.terms, resolvedCodenames);
            }
        }
    }

    private getTaxonomyTypeName(data: { taxonomy: ITaxonomyGroup; taxonomyResolver?: TaxonomyTypeResolver }): string {
        if (!data.taxonomyResolver) {
            return textHelper.toPascalCase(data.taxonomy.system.name);
        }

        if (data.taxonomyResolver instanceof Function) {
            return `${data.taxonomyResolver(data.taxonomy)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.system.name, data.taxonomyResolver)}`;
    }
}

export const deliveryTaxonomylGenerator = new DeliveryTaxonomyGenerator();
